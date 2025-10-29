import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../../entities/admin.entity';

@Injectable()
export class VerifyAdminAdminGuard implements CanActivate {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { internal_user_id } = request;
    const admin = await this.adminModel.findOne({
      where: {
        id_user: internal_user_id,
        id_admin_type: 1,
      },
    });
    if (!admin) {
      throw new ForbiddenException({
        title: 'Operación No Permitida',
        message: 'El usuario no tiene permisos para realizar la operación.',
        status: 403,
        code: 'admin',
      });
    }
    request.internal_store_id = admin.getDataValue('id_store');
    return true;
  }
}
