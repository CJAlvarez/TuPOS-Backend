"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
function setupRailwayAutoShutdown() {
    if (!process.env.RAILWAY_ENVIRONMENT_NAME) {
        return;
    }
    const activeHours = parseInt(process.env.ACTIVE_HOURS || '11', 10);
    const activeTimeMs = activeHours * 60 * 60 * 1000;
    console.log(`🚀 [Railway] Servicio iniciado. Permanecerá activo por ${activeHours} horas.`);
    console.log(`⏰ [Railway] El contenedor se apagará automáticamente a las ${new Date(Date.now() + activeTimeMs).toLocaleString()}`);
    setTimeout(() => {
        console.log(`⏹️  [Railway] Tiempo de actividad completado (${activeHours} horas). Apagando contenedor...`);
        process.exit(0);
    }, activeTimeMs);
}
async function bootstrap() {
    setupRailwayAutoShutdown();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-app-key',
        exposedHeaders: 'Authorization',
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TuPOS Admin Backend API')
        .setDescription('API RESTful para la administración de clientes, usuarios y catálogos en TuPOS. Incluye autenticación, gestión de clientes, perfiles, catálogos, utilidades, etc. Documentación generada automáticamente con Swagger.')
        .setVersion('3.0.1')
        .addApiKey({
        type: 'apiKey',
        name: 'x-app-key',
        in: 'header',
        description: 'Llave de aplicación requerida para acceder a la API',
    }, 'app-key')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT para autenticación',
        in: 'header',
    }, 'JWT-auth')
        .addTag('auth', 'Autenticación y gestión de usuarios')
        .addTag('clients', 'Gestión de clientes')
        .addTag('catalogs', 'Catálogos y utilidades')
        .addTag('email', 'Envío de correos')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('ULMXYusjhyJhN7nhZc7DrijCMwzztL9rdTP64k2Rppj3vqHbz3ZaecvZP9YosM3FnznRF7i7ZfJJaZrUiKJN3ompHgR4NvCk9PXG', app, document);
    await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
//# sourceMappingURL=main.js.map