import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

/**
 * Decorador para aplicar la seguridad de llave de aplicación en Swagger
 * Úsalo en controladores o métodos específicos para documentar que requieren la llave
 */
export function AppKeySecurity() {
  return applyDecorators(
    ApiSecurity('app-key'),
  );
}