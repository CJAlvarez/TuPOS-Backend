import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

/**
 * Gestiona el tiempo de actividad del contenedor en Railway
 * Se ejecuta solo si está en entorno Railway
 */
function setupRailwayAutoShutdown(): void {
  // Verificar si estamos en Railway
  if (!process.env.RAILWAY_ENVIRONMENT_NAME) {
    return;
  }

  // Obtener las horas activas de la variable de entorno (por defecto 11 horas)
  const activeHours = parseInt(process.env.ACTIVE_HOURS || '11', 10);
  const activeTimeMs = activeHours * 60 * 60 * 1000; // Convertir a milisegundos

  console.log(`🚀 [Railway] Servicio iniciado. Permanecerá activo por ${activeHours} horas.`);
  console.log(`⏰ [Railway] El contenedor se apagará automáticamente a las ${new Date(Date.now() + activeTimeMs).toLocaleString()}`);

  // Configurar el timer para apagar el servicio
  setTimeout(() => {
    console.log(`⏹️  [Railway] Tiempo de actividad completado (${activeHours} horas). Apagando contenedor...`);
    process.exit(0);
  }, activeTimeMs);
}


async function bootstrap() {
  // Configurar auto-apagado en Railway antes de crear la app
  setupRailwayAutoShutdown();

  const app = await NestFactory.create(AppModule);

  // Configurar pipes de validación globales
  app.useGlobalPipes(new ValidationPipe({
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

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('TuPOS Admin Backend API')
    .setDescription(
      'API RESTful para la administración de clientes, usuarios y catálogos en TuPOS. Incluye autenticación, gestión de clientes, perfiles, catálogos, utilidades, etc. Documentación generada automáticamente con Swagger.',
    )
    .setVersion('3.0.1')
    // .addServer('/api')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-app-key',
        in: 'header',
        description: 'Llave de aplicación requerida para acceder a la API',
      },
      'app-key',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT para autenticación',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Autenticación y gestión de usuarios')
    .addTag('clients', 'Gestión de clientes')
    .addTag('catalogs', 'Catálogos y utilidades')
    .addTag('email', 'Envío de correos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
