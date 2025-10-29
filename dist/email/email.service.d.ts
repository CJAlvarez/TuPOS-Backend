import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail({ to, subject, html, }: {
        to: string;
        subject: string;
        html: string;
    }): Promise<void>;
    sendEmailTemplate({ to, subject, replacements, }: {
        to: string;
        subject: string;
        replacements: Record<string, any>;
    }): Promise<void>;
}
