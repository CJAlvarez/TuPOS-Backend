import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import * as request from 'supertest';
import { promises as fs } from 'fs';
import { join } from 'path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerifyTokenGuard } from './guards/verify-token.guard';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { Store } from '../entities/store.entity';
import { JobsService } from '../jobs/jobs.service';
import { PROFILE_IMAGES_DIR } from '../utils/files.paths';

const INTERNAL_USER_ID = 7;

describe('POST /auth/first-login', () => {
  let app: INestApplication;
  let dbUser: any;
  let profile: any;
  let userModel: any;
  let profileModel: any;
  const writtenFiles: string[] = [];

  beforeEach(async () => {
    dbUser = {
      id: INTERNAL_USER_ID,
      username: 'someone@tupos.test',
      password: 'old-hash',
      firstLogin: true,
      set: jest.fn(function (values: Record<string, any>) {
        Object.assign(this, values);
      }),
      save: jest.fn().mockResolvedValue(undefined),
      getDataValue: jest.fn(function (key: string) {
        return this[key];
      }),
      toJSON: () => ({
        id: INTERNAL_USER_ID,
        username: 'someone@tupos.test',
      }),
    };

    profile = {
      id_user: INTERNAL_USER_ID,
      firstname: 'Old',
      update: jest.fn().mockResolvedValue(undefined),
    };

    userModel = { findByPk: jest.fn().mockResolvedValue(dbUser) };
    profileModel = {
      findOne: jest.fn().mockResolvedValue(profile),
      create: jest.fn().mockResolvedValue(profile),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: () => 'signed-token' } },
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Profile), useValue: profileModel },
        { provide: getModelToken(Admin), useValue: {} },
        { provide: getModelToken(Store), useValue: {} },
        { provide: JobsService, useValue: { addJob: jest.fn() } },
      ],
    })
      .overrideGuard(VerifyTokenGuard)
      .useValue({
        canActivate: (context: any) => {
          context.switchToHttp().getRequest().internal_user_id =
            INTERNAL_USER_ID;
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    // Same global pipe configuration as main.ts.
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    while (writtenFiles.length) {
      await fs.rm(writtenFiles.pop()!, { force: true });
    }
  });

  it('accepts the multipart form the frontend sends and returns a session', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/first-login')
      .field('src', 'User-Male.svg')
      .field('firstname', 'Ada')
      .field('lastname', 'Lovelace')
      .field('gender', '2')
      .field('password', 'Secreta123')
      .field('confirm', 'Secreta123')
      .field('phone', '99887766')
      .field('email', 'someone@tupos.test')
      .expect(201);

    expect(response.body).toEqual({
      token: 'signed-token',
      first_login: false,
      id: INTERNAL_USER_ID,
    });

    expect(dbUser.firstLogin).toBe(false);
    expect(dbUser.password).not.toBe('old-hash');
    expect(dbUser.save).toHaveBeenCalled();

    expect(profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: 'Ada',
        lastname: 'Lovelace',
        id_gender: 2,
        phone: '99887766',
        image: 'User-Male.svg',
      }),
    );
  });

  it('stores an uploaded avatar and saves its filename on the profile', async () => {
    // 1x1 transparent PNG
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    );

    await request(app.getHttpServer())
      .post('/auth/first-login')
      .field('password', 'Secreta123')
      .field('confirm', 'Secreta123')
      .attach('file', png, 'avatar.png')
      .expect(201);

    const image = profile.update.mock.calls[0][0].image;
    expect(image).toMatch(/^profile-7-\d+\.png$/);

    const stored = join(PROFILE_IMAGES_DIR, image);
    writtenFiles.push(stored);
    await expect(fs.readFile(stored)).resolves.toEqual(png);
  });

  it('rejects mismatched confirmation', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/first-login')
      .field('password', 'Secreta123')
      .field('confirm', 'Otra123456')
      .expect(400);

    expect(response.body.title).toBe('Las contraseñas no coinciden');
    expect(dbUser.save).not.toHaveBeenCalled();
  });

  it('still accepts a JSON body using confirmPassword', async () => {
    await request(app.getHttpServer())
      .post('/auth/first-login')
      .send({ password: 'Secreta123', confirmPassword: 'Secreta123' })
      .expect(201);

    expect(dbUser.firstLogin).toBe(false);
  });

  it('rejects a password shorter than 6 characters', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/first-login')
      .field('password', 'abc')
      .field('confirm', 'abc')
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('password')]),
    );
  });
});
