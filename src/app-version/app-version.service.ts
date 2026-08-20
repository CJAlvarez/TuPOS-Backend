import { Injectable, Logger } from '@nestjs/common';
import { readOwnVersion, VERSION_PATTERN } from '../utils/app-version';

export interface AppVersionInfo {
  /** This backend's own version, read from its package.json. */
  version: string;
  /** Lowest admin client version accepted. Defaults to the backend's own. */
  min_version: string;
  /** Whether a client below `min_version` must be blocked. */
  mandatory_update: boolean;
}

@Injectable()
export class AppVersionService {
  private readonly logger = new Logger(AppVersionService.name);

  /**
   * Resolved once, at construction: package.json cannot change while the
   * process lives, and every client hits this endpoint at startup. The policy,
   * by contrast, is read from the environment on every call.
   */
  private readonly version = readOwnVersion();

  getVersionInfo(): AppVersionInfo {
    const configured = process.env.ADMIN_MIN_VERSION?.trim();
    const valid = !!configured && VERSION_PATTERN.test(configured);

    if (configured && !valid) {
      this.logger.warn(
        `ADMIN_MIN_VERSION="${configured}" no es una versión válida; se usa ${this.version}.`,
      );
    }

    return {
      version: this.version,

      // Defaulting the floor to the backend's own version is what makes a
      // deploy safe: shipping the backend at a new version is a no-op for every
      // client until someone deliberately raises this. It also allows a floor
      // BELOW the backend's version during a staged rollout, which is the case
      // that cannot be expressed with a single field.
      min_version: valid ? configured : this.version,

      // Compared strictly against 'true'. 'TRUE', '1' and 'yes' do NOT enable
      // the block, on purpose: the default for a misspelled variable has to be
      // "do not lock anyone out".
      mandatory_update: process.env.ADMIN_UPDATE_MANDATORY === 'true',
    };
  }
}
