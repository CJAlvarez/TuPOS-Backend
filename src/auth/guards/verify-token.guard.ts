import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Permitir bypass para pruebas/desarrollo
    if (
      this.configService.get('SKIP_VERIFY') &&
      this.configService.get('INTERNAL_USER_ID')
    ) {
      request.internal_user_id = this.configService.get('INTERNAL_USER_ID');
      return true;
    }
    const { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedException({
        auth: false,
        title: 'Acceso No Autorizado',
        message: 'Intento acceder a un recurso prohibido',
        code: 'auth',
        status: 401,
      });
    }
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException({
        auth: false,
        title: 'Acceso No Autorizado',
        message: 'Intento acceder a un recurso prohibido',
        code: 'auth',
        status: 401,
      });
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('TOKEN_SECRET_KEY'),
      });
      request.internal_user_id = decoded.id_user;
      return true;
    } catch (err) {
      throw new UnauthorizedException({
        auth: false,
        title: 'Acceso No Autorizado',
        message: 'Intento acceder a un recurso prohibido',
        code: 'auth',
        status: 401,
      });
    }
  }
}
