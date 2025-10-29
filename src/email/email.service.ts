import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      host: this.configService.get<string>('EMAIL_HOST'),
      name: this.configService.get<string>('EMAIL_NAME'),
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    if (!subject || !html) {
      throw new InternalServerErrorException(
        'Por favor verifique los datos ingresados.',
      );
    }
    const mailOptions = {
      from: `${this.configService.get<string>('EMAIL_NAME')} <${this.configService.get<string>('APP_EMAIL')}>`,
      to: to || 'trash@tuposhn.com',
      subject,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      throw new InternalServerErrorException(
        'Error enviando correo: ' + err.message,
      );
    }
  }

  async sendEmailTemplate({
    to,
    subject,
    replacements,
  }: {
    to: string;
    subject: string;
    replacements: Record<string, any>;
  }) {
    if (!subject || !replacements) {
      throw new InternalServerErrorException(
        'Por favor verifique los datos ingresados.',
      );
    }
    const templatePath = path.join(
      __dirname,
      '../../public/sys_files/template-1.html',
    );
    let html: string;
    try {
      html = await fs.readFile(templatePath, { encoding: 'utf-8' });
    } catch (err) {
      throw new InternalServerErrorException(
        'No se pudo leer la plantilla de correo.',
      );
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
      from: `${this.configService.get<string>('EMAIL_NAME')} <${this.configService.get<string>('APP_EMAIL')}>`,
      to: to || 'trash@tuposhn.com',
      subject,
      html: htmlToSend,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      throw new InternalServerErrorException(
        'Error enviando correo: ' + err.message,
      );
    }
  }
}
