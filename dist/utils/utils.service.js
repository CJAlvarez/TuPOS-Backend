"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const csv_writer_1 = require("csv-writer");
let UtilsService = class UtilsService {
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
    generateToken(size, level = 1) {
        const lower = 'abcdefghijklmnopqurstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '.!@#$%&*)_+(,:;';
        const result = [];
        if (level === 1) {
            for (let i = 0; i < size - 1; i++)
                result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
            result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
        }
        else if (level === 2) {
            for (let i = 0; i < size - 2; i++)
                result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
            result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
            result.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
        }
        else if (level === 3) {
            for (let i = 0; i < size - 3; i++)
                result.push(lower.charAt(Math.floor(Math.random() * lower.length)));
            result.push(upper.charAt(Math.floor(Math.random() * upper.length)));
            result.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
            result.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
        }
        return result.join('');
    }
    encrypt(text, key, iv) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    decrypt(text, key, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    async createCsv({ data, filename, headers, }) {
        const mypath = path.join(__dirname, '../../files/csv/', filename);
        if (!data || data.length <= 0)
            data = [{ 'No hay datos para exportación': '' }];
        if (!headers) {
            headers = Object.keys(data[0]).map((x) => ({
                id: x,
                title: x.replace(/_/g, ' '),
            }));
        }
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({ header: headers });
        const csvContent = '\ufeff' +
            csvStringifier.getHeaderString() +
            csvStringifier.stringifyRecords(data);
        await fs.writeFile(mypath, csvContent, 'utf8');
        return mypath;
    }
    async readHtmlFile(filePath) {
        return fs.readFile(filePath, { encoding: 'utf-8' });
    }
    async cleanFilesDirectory() {
        const directory = path.join(__dirname, '../files');
        try {
            const files = await fs.readdir(directory);
            for (const file of files) {
                await fs.unlink(path.join(directory, file));
            }
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error en limpieza de directorio.');
        }
    }
    paginate(limit, skip, count, last) {
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
    fixNumber(num, min = 2, max = 2) {
        return num.toLocaleString('es-HN', {
            minimumFractionDigits: min,
            maximumFractionDigits: max,
        });
    }
};
exports.UtilsService = UtilsService;
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
//# sourceMappingURL=utils.service.js.map