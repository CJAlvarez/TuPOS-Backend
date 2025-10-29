import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');
import {
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: any;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: getModelToken(User), useValue: userModel },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const user = {
        username: 'test',
        password: 'hashed',
        toJSON: () => ({ id: 1, username: 'test', password: 'hashed' }),
      };
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.validateUser('test', 'password');
      expect(result).toHaveProperty('id', 1);
      expect(result).not.toHaveProperty('password');
    });
    it('should return null if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      const result = await service.validateUser('test', 'password');
      expect(result).toBeNull();
    });
    it('should return null if password does not match', async () => {
      const user = {
        username: 'test',
        password: 'hashed',
        toJSON: () => ({ id: 1, username: 'test', password: 'hashed' }),
      };
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      const result = await service.validateUser('test', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token and user data if credentials are valid', async () => {
      const user = {
        username: 'test',
        password: 'hashed',
        id: 1,
        toJSON: () => ({ id: 1, username: 'test', password: 'hashed' }),
      };
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      const result = await service.login({
        username: 'test',
        password: 'password',
      } as any);
      expect(result).toHaveProperty('access_token', 'signed-token');
      expect(result.user).toHaveProperty('id', 1);
    });
    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(
        service.login({ username: 'test', password: 'password' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if password does not match', async () => {
      const user = {
        username: 'test',
        password: 'hashed',
        id: 1,
        toJSON: () => ({ id: 1, username: 'test', password: 'hashed' }),
      };
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      await expect(
        service.login({ username: 'test', password: 'password' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('should change password if current password matches and passwords match', async () => {
      const dbUser = {
        password: 'hashed',
        save: jest.fn(),
        toJSON: () => ({ id: 1, username: 'test' }),
      };
      userModel.findByPk.mockResolvedValue(dbUser);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('newhash');
      const dto = {
        currentPassword: 'old',
        password: 'new',
        confirmPassword: 'new',
      };
      const result = await service.changePassword(
        { internal_user_id: 1 },
        dto as any,
      );
      expect(dbUser.password).toBe('newhash');
      expect(result).toHaveProperty('message');
    });
    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);
      const dto = {
        currentPassword: 'old',
        password: 'new',
        confirmPassword: 'new',
      };
      await expect(
        service.changePassword({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException if passwords do not match', async () => {
      const dbUser = { password: 'hashed', save: jest.fn() };
      userModel.findByPk.mockResolvedValue(dbUser);
      const dto = {
        currentPassword: 'old',
        password: 'new',
        confirmPassword: 'other',
      };
      await expect(
        service.changePassword({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException if current password is invalid', async () => {
      const dbUser = { password: 'hashed', save: jest.fn() };
      userModel.findByPk.mockResolvedValue(dbUser);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      const dto = {
        currentPassword: 'old',
        password: 'new',
        confirmPassword: 'new',
      };
      await expect(
        service.changePassword({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('recoverPassword', () => {
    it('should return message and token if user exists', async () => {
      const user = { email: 'test@test.com', save: jest.fn() };
      userModel.findOne.mockResolvedValue(user);
      const result = await service.recoverPassword({
        email: 'test@test.com',
      } as any);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('token', 'signed-token');
    });
    it('should throw BadRequestException if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(
        service.recoverPassword({ email: 'test@test.com' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password if token is valid', async () => {
      const user = { password: 'old', restoreCode: 'token', save: jest.fn() };
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('newhash');
      const result = await service.resetPassword({ internal_user_id: 1 }, {
        token: 'token',
        newPassword: 'new',
      } as any);
      expect(user.password).toBe('newhash');
      expect(user.restoreCode).toBeNull();
      expect(result).toHaveProperty('message');
    });
    it('should throw BadRequestException if token is invalid', async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(
        service.resetPassword({ internal_user_id: 1 }, {
          token: 'token',
          newPassword: 'new',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('firstLogin', () => {
    it('should set password and firstLogin=false if valid', async () => {
      const dbUser = { password: 'old', firstLogin: true, save: jest.fn() };
      userModel.findByPk.mockResolvedValue(dbUser);
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('newhash');
      const dto = { password: 'new', confirmPassword: 'new' };
      const result = await service.firstLogin(
        { internal_user_id: 1 },
        dto as any,
      );
      expect(dbUser.password).toBe('newhash');
      expect(dbUser.firstLogin).toBe(false);
      expect(result).toHaveProperty('message');
    });
    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);
      const dto = { password: 'new', confirmPassword: 'new' };
      await expect(
        service.firstLogin({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException if passwords do not match', async () => {
      const dbUser = { password: 'old', firstLogin: true, save: jest.fn() };
      userModel.findByPk.mockResolvedValue(dbUser);
      const dto = { password: 'new', confirmPassword: 'other' };
      await expect(
        service.firstLogin({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException if firstLogin is false', async () => {
      const dbUser = { password: 'old', firstLogin: false, save: jest.fn() };
      userModel.findByPk.mockResolvedValue(dbUser);
      const dto = { password: 'new', confirmPassword: 'new' };
      await expect(
        service.firstLogin({ internal_user_id: 1 }, dto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
