import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { NotFoundException, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';
import { AppKeyGuard } from '../guards/app-key.guard';
import { SKIP_APP_KEY } from '../guards/skip-app-key.decorator';
import { VERSION_PATTERN } from '../utils/app-version';

describe('AppVersionController', () => {
  const originalMin = process.env.ADMIN_MIN_VERSION;
  const originalMandatory = process.env.ADMIN_UPDATE_MANDATORY;

  let controller: AppVersionController;

  const build = async (): Promise<AppVersionController> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppVersionController],
      providers: [AppVersionService],
    })
      // ThrottlerGuard resolves THROTTLER:MODULE_OPTIONS and ThrottlerStorage
      // from AppVersionModule, which this spec does not build. Rate limiting is
      // not what these assertions are about.
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    return app.get<AppVersionController>(AppVersionController);
  };

  beforeEach(async () => {
    delete process.env.ADMIN_MIN_VERSION;
    delete process.env.ADMIN_UPDATE_MANDATORY;
    controller = await build();
  });

  afterEach(() => {
    process.env.ADMIN_MIN_VERSION = originalMin;
    process.env.ADMIN_UPDATE_MANDATORY = originalMandatory;
  });

  describe('app-version', () => {
    it('should report the version from its own package.json', () => {
      const result = controller.getVersionInfo();
      expect(result.version).toMatch(VERSION_PATTERN);
      // 0.0.0 is the failure value; seeing it means the read found nothing.
      expect(result.version).not.toBe('0.0.0');
    });

    it('should default the floor to its own version and demand nothing', () => {
      const result = controller.getVersionInfo();
      expect(result.min_version).toBe(result.version);
      expect(result.mandatory_update).toBe(false);
    });

    // The default for a misspelled variable has to be "do not lock anyone
    // out", so every near-miss must read as false.
    it.each(['TRUE', 'True', '1', 'yes', 'on', ''])(
      'should NOT treat ADMIN_UPDATE_MANDATORY=%p as mandatory',
      (value) => {
        process.env.ADMIN_UPDATE_MANDATORY = value;
        expect(controller.getVersionInfo().mandatory_update).toBe(false);
      },
    );

    it('should treat the exact string "true" as mandatory', () => {
      process.env.ADMIN_UPDATE_MANDATORY = 'true';
      expect(controller.getVersionInfo().mandatory_update).toBe(true);
    });

    it('should accept a floor below its own version, for a staged rollout', () => {
      process.env.ADMIN_MIN_VERSION = '1.0.0';
      expect(controller.getVersionInfo().min_version).toBe('1.0.0');
    });

    it.each(['no-soy-una-version', '26.2.1-beta', 'v26.2.1', '  '])(
      'should ignore the malformed ADMIN_MIN_VERSION=%p instead of publishing it',
      (value) => {
        process.env.ADMIN_MIN_VERSION = value;
        const result = controller.getVersionInfo();
        expect(result.min_version).toBe(result.version);
      },
    );

    it('should re-read the policy on every call, while caching the version', () => {
      const first = controller.getVersionInfo();

      process.env.ADMIN_MIN_VERSION = '99.0.0';
      process.env.ADMIN_UPDATE_MANDATORY = 'true';
      const second = controller.getVersionInfo();

      // The policy can change without a new instance; the version cannot
      // change while the process lives, so it stays cached.
      expect(second.min_version).toBe('99.0.0');
      expect(second.mandatory_update).toBe(true);
      expect(second.version).toBe(first.version);
    });

    it('should be marked to skip the global AppKeyGuard', () => {
      const skip = new Reflector().get<boolean>(
        SKIP_APP_KEY,
        AppVersionController.prototype.getVersionInfo,
      );
      expect(skip).toBe(true);
    });

    describe('AppKeyGuard interaction', () => {
      const originalAppKey = process.env.APP_KEY;
      let guard: AppKeyGuard;

      const contextFor = (handler: () => unknown) =>
        ({
          getHandler: () => handler,
          getClass: () => AppVersionController,
          switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
        }) as unknown as ExecutionContext;

      beforeEach(() => {
        process.env.APP_KEY = 'test-app-key';
        guard = new AppKeyGuard(new Reflector());
      });

      afterEach(() => {
        process.env.APP_KEY = originalAppKey;
      });

      it('should let app-version through without an x-app-key header', () => {
        // The frontend reads this before logging in, and an installer whose app
        // key has drifted is exactly the client that needs to be told to
        // update. Requiring the key would answer it with a 404.
        expect(
          guard.canActivate(
            contextFor(AppVersionController.prototype.getVersionInfo),
          ),
        ).toBe(true);
      });

      it('should still reject an unmarked handler', () => {
        expect(() => guard.canActivate(contextFor(() => undefined))).toThrow(
          NotFoundException,
        );
      });
    });
  });
});
