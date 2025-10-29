import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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