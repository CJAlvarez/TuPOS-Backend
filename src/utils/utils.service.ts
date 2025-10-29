import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class UtilsService {
  // Valores
  months = [
    { n: '1', value: '01', label: 'Enero' },
    { n: '2', value: '02', label: 'Febrero' },
    { n: '3', value: '03', label: 'Marzo' },
    { n: '4', value: '04', label: 'Abril' },
    { n: '5', value: '05', label: 'Mayo' },
    { n: '6', value: '06', label: 'Junio' },
    { n: '7', value: '07', label: 'Julio' },
    { n: '8', value: '08', label: 'Agosto' },
    { n: '9', value: '09', label: 'Septiembre' },
    { n: '10', value: '10', label: 'Octubre' },
    { n: '11', value: '11', label: 'Noviembre' },
    { n: '12', value: '12', label: 'Diciembre' },
  ];

  /**
   * Generates a random token string of the specified size and complexity level.
   *
   * @param size - The desired length of the generated token.
   * @param level - The complexity level of the token:
   *   - `1`: Lowercase letters with one uppercase letter at the end.
   *   - `2`: Lowercase letters, one uppercase letter, and one digit.
   *   - `3`: Lowercase letters, one uppercase letter, one digit, and one symbol.
   *   Defaults to `1` if not provided.
   * @returns A randomly generated token string.
   *
   * @example
   * ```typescript
   * const token1 = utilsService.generateToken(8); // e.g., "abcdxyzQ"
   * const token2 = utilsService.generateToken(10, 2); // e.g., "abcdefgH3"
   * const token3 = utilsService.generateToken(12, 3); // e.g., "abcdefghiJ4!"
   * ```
   */
  generateToken(size: number, level = 1): string {
    const lower = 'abcdefghijklmnopqurstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '.!@#$%&*)_+(,:;';
    const result: string[] = [];
    if (level === 1) {
      for (let i = 0; i < size - 1; i++)
        result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
      result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
    } else if (level === 2) {
      for (let i = 0; i < size - 2; i++)
        result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
      result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
      result.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    } else if (level === 3) {
      for (let i = 0; i < size - 3; i++)
        result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
      result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
      result.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
      result.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
    }
    return result.join('');
  }

  // Cifrado y descifrado (requiere clave y IV seguros)
  encrypt(text: string, key: Buffer, iv: Buffer): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text: string, key: Buffer, iv: Buffer): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  // Crear CSV
  async createCsv({
    data,
    filename,
    headers,
  }: {
    data: any[];
    filename: string;
    headers?: any[];
  }): Promise<string> {
    const mypath = path.join(__dirname, '../../files/csv/', filename);
    if (!data || data.length <= 0)
      data = [{ 'No hay datos para exportación': '' }];
    if (!headers) {
      headers = Object.keys(data[0]).map((x) => ({
        id: x,
        title: x.replace(/_/g, ' '),
      }));
    }
    const csvStringifier = createObjectCsvStringifier({ header: headers });
    const csvContent =
      '\ufeff' +
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(data);
    await fs.writeFile(mypath, csvContent, 'utf8');
    return mypath;
  }

  // Leer archivo HTML
  async readHtmlFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, { encoding: 'utf-8' });
  }

  // Limpiar directorio de archivos
  async cleanFilesDirectory(): Promise<void> {
    const directory = path.join(__dirname, '../files');
    try {
      const files = await fs.readdir(directory);
      for (const file of files) {
        await fs.unlink(path.join(directory, file));
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Error en limpieza de directorio.',
      );
    }
  }

  /**
   * Calculates pagination parameters based on the provided limit, skip, total count, and last page flag.
   *
   * @param limit - The number of items per page. Defaults to 10 if not provided or invalid.
   * @param skip - The page number to skip to (zero-based). Defaults to 0 if not provided or invalid.
   * @param count - The total number of items available.
   * @param last - If true, calculates pagination for the last page.
   * @returns An object containing:
   *   - `limit`: The validated number of items per page.
   *   - `skip`: The validated page number.
   *   - `offset`: The calculated offset (skip * limit).
   *
   * @example
   * ```typescript
   * const { limit, skip, offset } = utilsService.paginate(10, 2, 50, false);
   * // limit = 10, skip = 2, offset = 20
   * ```
   */
  paginate(
    limit: number,
    skip: number,
    count: number,
    last: boolean,
  ): { limit: number; skip: number; offset: number } {
    limit = limit ? Number(limit) : 10;
    skip = skip ? Number(skip) : 0;
    let offset = skip * limit;
    if (offset >= count || last + '' === 'true') {
      skip = Math.floor((count - 1) / limit);
      offset = skip * limit;
    }
    return {
      limit: isNaN(limit) || limit < 0 ? 0 : limit,
      skip: isNaN(skip) || skip < 0 ? 0 : skip,
      offset: isNaN(offset) || offset < 0 ? 0 : offset,
    };
  }

  // Formatear número
  fixNumber(num: number, min = 2, max = 2): string {
    return num.toLocaleString('es-HN', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }
}
