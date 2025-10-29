import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../entities/admin.entity';

@Injectable()
export class VerifyDisabledUserGuard implements CanActivate {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { internal_user_id } = request;
    const admin = await this.adminModel.findOne({
      where: {
        id_user: internal_user_id,
        deleted_at: null as any,
      },
    });
    if (!admin) {
      throw new ForbiddenException({
        title: 'Usuario inexistente',
        message: 'Vuelva a intentarlo.',
        status: 403,
        code: 'disabled',
      });
    }
    if (admin.disabled_at) {
      throw new ForbiddenException({
        title: 'Usuario Bloqueado',
        message: 'Este usuario ha sido bloqueado.',
        status: 403,
        code: 'disabled',
      });
    }
    return true;
  }
}
