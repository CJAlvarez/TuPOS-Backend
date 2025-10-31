import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { Store } from '../entities/store.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { FirstLoginDto } from './dto/first-login.dto';
import { Op } from 'sequelize';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Profile) private readonly profileModel: typeof Profile,
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
    @InjectModel(Store) private readonly storeModel: typeof Store,
    private readonly jobsService: JobsService,
  ) {}
  async getUserData(id_user: number): Promise<any> {
    const user = (
      await this.userModel.findOne({
        where: { id: id_user },
        attributes: ['username', 'email'],
        include: [
          {
            model: Profile,
            as: 'profile',
          },
          {
            model: Admin,
            as: 'admin',
            include: [
              {
                model: Store,
                as: 'store',
                attributes: ['id', 'name', 'code', 'theme_config'],
              },
            ],
          },
        ],
      })
    )?.toJSON();
    if (!user) throw new NotFoundException('Usuario inexistente');

    // Extract store information if admin exists
    const storeData = user.admin?.store || null;

    const result = {
      username: user.username,
      email: user.email,
      ...user.profile,
      store: storeData,
    };
    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    const { password: _pw, ...result } = user.toJSON();
    return result;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = (
      await this.userModel.findOne({
        where: {
          [Op.or]: [
            { username: loginDto.username },
            { email: loginDto.username },
          ],
        },
        include: [
          {
            model: this.profileModel,
            as: 'profile',
          },
        ],
      })
    )?.toJSON();
    if (!user)
      throw new UnauthorizedException({
        title: 'Correo o contraseña incorrecta',
        message: 'Vuelva a intentarlo.',
        status: 401,
        code: 'user',
      });
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException({
        title: 'Correo o contraseña incorrecta',
        message: 'Vuelva a intentarlo.',
        status: 401,
        code: 'password',
      });
    if (user.disabledAt)
      throw new UnauthorizedException({
        title: 'Cuenta deshabilitada',
        message: 'Contacta al administrador.',
        status: 403,
        code: 'disabled',
      });

    const payload = {
      username: user.username,
      id_user: user.id,
      name: user.profile?.firstname,
    };
    return {
      token: this.jwtService.sign(payload),
      first_login: user.firstLogin,
      id: user.id,
    };
  }

  async changePassword(
    internal_user_id: any,
    dto: ChangePasswordDto,
  ): Promise<any> {
    const dbUser = await this.userModel.findByPk(internal_user_id);
    if (!dbUser) throw new NotFoundException('Usuario no encontrado');
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }
    // Validar contraseña actual
    const isMatch = await bcrypt.compare(
      dto.current_password,
      dbUser.getDataValue('password'),
    );
    if (!isMatch)
      throw new BadRequestException('La contraseña actual no es válida.');
    // Guardar nueva contraseña
    const newHash = await bcrypt.hash(dto.password, 10);
    dbUser.set({ password: newHash });
    await dbUser.save();
    return { message: 'Contraseña cambiada correctamente.' };
  }

  async recoverPassword(dto: RecoverPasswordDto): Promise<any> {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new BadRequestException('El correo no está registrado');
    const _user = user.toJSON();
    const token = this.jwtService.sign({ sub: _user.id }, { expiresIn: '1h' });
    user.setDataValue('restoreCode', token);
    await user.save();

    await this.jobsService.addJob({
      type: 'sendEmailTemplate',
      data: {
        to: _user.email,
        subject: 'Recupera tu Cuenta',
        replacements: {
          logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
          logo_light: 'https://tuposhn.com/assets/images/logotipo-blanco.png',
          content: [
            { type: 'title', text: '¿Problemas con tu contraseña?' },
            { type: 'skip' },
            { type: 'skip' },
            {
              type: 'normal',
              text: 'No te preocupes, crea una nueva contraseña y continúa moviéndote.',
            },
            { type: 'skip' },
            {
              type: 'button',
              text: 'NUEVA CONTRASEÑA',
              ref: `${process.env.FRONTEND_URL}/reset-password/${token}`,
            },
            { type: 'skip' },
            { type: 'skip' },
            { type: 'bold', text: '¿No sabes de lo que hablo?' },
            { type: 'skip' },
            {
              type: 'normal',
              text: 'Ignora este correo. Tu contraseña continuará siendo la misma.',
            },
          ],
        },
      },
    });

    return {
      title: 'Recuperación de cuenta.',
      message: `Se ha enviado un enlace de recuperación a <code> ${_user.email}</code>.<br>Este será válido por ${process.env.RECOVERY_TOKEN_INTERVAL} hora(s).`,
      code: 'recovery_password',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<any> {
    const user = await this.userModel.findOne({
      where: { restoreCode: dto.token, email: dto.email },
    });
    if (!user) throw new BadRequestException('Token inválido');
    const newHash = await bcrypt.hash(dto.password, 10);
    user.password = newHash;
    user.restoreCode = null;
    await user.save();
    return {
      title: 'Recuperación de cuenta.',
      message: 'Se ha restaurado tu contraseña con exito.',
      code: 'reset_password',
    };
  }

  async firstLogin(internal_user_id: any, dto: FirstLoginDto): Promise<any> {
    const dbUser = await this.userModel.findByPk(internal_user_id);
    if (!dbUser) throw new NotFoundException('Usuario no encontrado');
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    if (dbUser.firstLogin === false) {
      throw new BadRequestException('El usuario ya realizó el primer login');
    }
    const newHash = await bcrypt.hash(dto.password, 10);
    dbUser.password = newHash;
    dbUser.firstLogin = false;
    await dbUser.save();
    return { message: 'Contraseña establecida correctamente en primer login' };
  }
}
