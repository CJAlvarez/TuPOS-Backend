import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService],
    }).compile();
    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate token of correct length', () => {
    const token = service.generateToken(10);
    expect(token.length).toBe(10);
  });

  it('should encrypt and decrypt text', () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const text = 'test123';
    const encrypted = service.encrypt(text, key, iv);
    const decrypted = service.decrypt(encrypted, key, iv);
    expect(decrypted).toBe(text);
  });

  it('should create CSV file', async () => {
    const spy = jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined as any);
    const path = await service.createCsv({
      data: [{ a: 1 }],
      filename: 'test.csv',
    });
    expect(path).toContain('test.csv');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should read HTML file', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue('<b>html</b>' as any);
    const html = await service.readHtmlFile('fake.html');
    expect(html).toBe('<b>html</b>');
  });

  it('should clean files directory', async () => {
    jest.spyOn(fs, 'readdir').mockResolvedValue(['a.txt', 'b.txt'] as any);
    jest.spyOn(fs, 'unlink').mockResolvedValue(undefined as any);
    await expect(service.cleanFilesDirectory()).resolves.toBeUndefined();
  });

  it('should calculate pagination', () => {
    const result = service.paginate(10, 1, 100, false);
    expect(result).toEqual({ limit: 10, skip: 1, offset: 10 });
  });

  it('should fix number format', () => {
    expect(service.fixNumber(1234.567, 2, 2)).toBe('1,234.57');
  });
});
