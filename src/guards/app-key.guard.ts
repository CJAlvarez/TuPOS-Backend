import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_APP_KEY } from './skip-app-key.decorator';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Rutas marcadas con @SkipAppKey() quedan fuera de la validación
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_APP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const appKey = request.headers['x-app-key'] as string;
    const validAppKey = process.env.APP_KEY;

    // Si no está configurada la llave en el servidor, permitir acceso
    if (!validAppKey) {
      return true;
    }

    // Si no se proporciona la llave o es incorrecta, devolver 404 (no 401/403)
    if (!appKey || appKey !== validAppKey) {
      throw new NotFoundException();
    }

    return true;
  }
}
