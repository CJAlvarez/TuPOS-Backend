import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs/promises';

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn().mockResolvedValue(true);
    jest
      .spyOn(nodemailer, 'createTransport')
      .mockReturnValue({ sendMail: sendMailMock } as any);
    configService = {
      get: jest.fn((key: string) => {
        const map = {
          EMAIL_SERVICE: 'gmail',
          EMAIL_HOST: 'smtp.gmail.com',
          EMAIL_NAME: 'Test',
          EMAIL_USER: 'test@mail.com',
          EMAIL_PASSWORD: 'pass',
        };
        return map[key];
      }),
    } as any;
    service = new EmailService(configService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email with correct options', async () => {
    await service.sendEmail({
      to: 'to@mail.com',
      subject: 'Test',
      html: '<b>Hi</b>',
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'Test <test@mail.com>',
      to: 'to@mail.com',
      subject: 'Test',
      html: '<b>Hi</b>',
    });
  });

  it('should throw if subject or html is missing', async () => {
    await expect(
      service.sendEmail({ to: 'to@mail.com', subject: '', html: '' }),
    ).rejects.toThrow();
  });

  it('should send email with template', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue('<b>{{subject}}</b>' as any);
    await service.sendEmailTemplate({
      to: 'to@mail.com',
      subject: 'Test',
      replacements: {},
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'Test <test@mail.com>',
      to: 'to@mail.com',
      subject: 'Test',
      html: '<b>Test</b>',
    });
  });

  it('should throw if template file not found', async () => {
    jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('not found'));
    await expect(
      service.sendEmailTemplate({
        to: 'to@mail.com',
        subject: 'Test',
        replacements: {},
      }),
    ).rejects.toThrow('No se pudo leer la plantilla de correo.');
  });

  it('should throw if subject or replacements is missing in template', async () => {
    await expect(
      service.sendEmailTemplate({
        to: 'to@mail.com',
        subject: '',
        replacements: undefined as any,
      }),
    ).rejects.toThrow();
  });
});
