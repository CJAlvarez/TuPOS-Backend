"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs/promises");
const path = require("path");
let EmailService = class EmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            service: this.configService.get('EMAIL_SERVICE'),
            host: this.configService.get('EMAIL_HOST'),
            name: this.configService.get('EMAIL_NAME'),
            port: 465,
            secure: true,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }
    async sendEmail({ to, subject, html, }) {
        if (!subject || !html) {
            throw new common_1.InternalServerErrorException('Por favor verifique los datos ingresados.');
        }
        const mailOptions = {
            from: `${this.configService.get('EMAIL_NAME')} <${this.configService.get('APP_EMAIL')}>`,
            to: to || 'trash@tuposhn.com',
            subject,
            html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error enviando correo: ' + err.message);
        }
    }
    async sendEmailTemplate({ to, subject, replacements, }) {
        if (!subject || !replacements) {
            throw new common_1.InternalServerErrorException('Por favor verifique los datos ingresados.');
        }
        const templatePath = path.join(__dirname, '../../public/sys_files/template-1.html');
        let html;
        try {
            html = await fs.readFile(templatePath, { encoding: 'utf-8' });
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('No se pudo leer la plantilla de correo.');
        }
        const template = handlebars.compile(html);
        const in_replacements = {
            ...replacements,
            subject,
            year: new Date().getFullYear(),
        };
        handlebars.registerHelper('ifEquals', (word1, word2) => word1 == word2);
        const htmlToSend = template(in_replacements);
        const mailOptions = {
            from: `${this.configService.get('EMAIL_NAME')} <${this.configService.get('APP_EMAIL')}>`,
            to: to || 'trash@tuposhn.com',
            subject,
            html: htmlToSend,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error enviando correo: ' + err.message);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map