import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_VERSION_FLOOR } from './skip-version-floor.decorator';
import { isBehind, readOwnVersion, VERSION_PATTERN } from '../utils/app-version';

/** 426 Upgrade Required. NestJS's HttpStatus enum does not define it. */
const HTTP_UPGRADE_REQUIRED = 426;

/**
 * Rechaza con HTTP 426 las peticiones de clientes que están demostrablemente
 * por debajo del piso de versión, cuando la actualización es obligatoria.
 *
 * Es defensa en profundidad, no el mecanismo principal. El bloqueo real lo hace
 * el frontend cuando lee `GET /api/app-version`; esto cubre el caso en que ese
 * frontend no lo respete: una versión vieja anterior al gate, una pestaña que
 * quedó abierta desde antes de subir el piso, o un cliente modificado.
 *
 * FALLA HACIA "NO BLOQUEAR", igual que el gate del frontend. Cualquier duda
 * deja pasar la petición:
 *
 *  - Sin cabecera `x-app-version` → pasa. Un cliente viejo no la manda, y
 *    dejarlo fuera de la API entera le impediría incluso enterarse.
 *  - Cabecera ilegible → pasa. Un proxy que reescriba la cabecera no puede
 *    tumbar la operación.
 *  - `ADMIN_UPDATE_MANDATORY` distinto de `'true'` → pasa. La política blanda
 *    la resuelve el frontend con un aviso; aquí no se rechaza nada.
 *  - `ADMIN_MIN_VERSION` mal escrita → se ignora y se usa la versión propia.
 */
@Injectable()
export class AppVersionFloorGuard implements CanActivate {
  private readonly logger = new Logger(AppVersionFloorGuard.name);

  /** package.json no cambia mientras vive el proceso; la política sí. */
  private readonly ownVersion = readOwnVersion();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (process.env.ADMIN_UPDATE_MANDATORY !== 'true') {
      return true;
    }

    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_VERSION_FLOOR, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const clientVersion = request.headers['x-app-version'] as string | undefined;
    if (!clientVersion) {
      return true;
    }

    const configured = process.env.ADMIN_MIN_VERSION?.trim();
    const floor =
      configured && VERSION_PATTERN.test(configured) ? configured : this.ownVersion;

    if (!isBehind(clientVersion, floor)) {
      return true;
    }

    this.logger.warn(
      `Cliente ${clientVersion} rechazado: por debajo del piso ${floor}.`,
    );

    throw new HttpException(
      {
        title: 'Actualización obligatoria',
        message: `Esta versión (${clientVersion}) ya no está permitida. Se necesita la ${floor}.`,
        status: HTTP_UPGRADE_REQUIRED,
        code: 'update-required',
        min_version: floor,
      },
      HTTP_UPGRADE_REQUIRED,
    );
  }
}
