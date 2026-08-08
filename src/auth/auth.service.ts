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
import { UploadedFile } from './types/uploaded-file.interface';
import { PROFILE_IMAGES_DIR } from 'src/utils/files.paths';
import { Op } from 'sequelize';
import { JobsService } from 'src/jobs/jobs.service';
import { promises as fs } from 'fs';
import { extname, join } from 'path';

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
      id_admin_type: user.admin ? user.admin.id_admin_type : null,
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

  async firstLogin(
    internal_user_id: any,
    dto: FirstLoginDto,
    avatar?: UploadedFile,
  ): Promise<any> {
    const dbUser = await this.userModel.findByPk(internal_user_id);
    if (!dbUser)
      throw new NotFoundException({
        title: 'Usuario no encontrado',
        message: 'La sesión no corresponde a un usuario válido.',
        status: 404,
        code: 'user',
      });

    // The form posts the confirmation as `confirm`; `confirmPassword` stays
    // supported for API clients that already use it.
    const confirmation = dto.confirm ?? dto.confirmPassword;
    if (!confirmation)
      throw new BadRequestException({
        title: 'Confirmación requerida',
        message: 'Debes confirmar la nueva contraseña.',
        status: 400,
        code: 'confirm',
      });
    if (dto.password !== confirmation)
      throw new BadRequestException({
        title: 'Las contraseñas no coinciden',
        message: 'Verifica la nueva contraseña y su confirmación.',
        status: 400,
        code: 'password',
      });
    if (dbUser.firstLogin === false)
      throw new BadRequestException({
        title: 'Primer inicio ya completado',
        message: 'Este usuario ya realizó su primer inicio de sesión.',
        status: 400,
        code: 'first_login',
      });

    const newHash = await bcrypt.hash(dto.password, 10);
    dbUser.set({ password: newHash, firstLogin: false });
    await dbUser.save();

    const profile = await this.saveFirstLoginProfile(
      Number(dbUser.getDataValue('id')),
      dto,
      avatar,
    );

    // The frontend replaces its whole session with this response, so it has to
    // mirror the login payload — otherwise the token is lost and the guard
    // bounces the user back to /primer_inicio forever.
    const user = dbUser.toJSON();
    return {
      token: this.jwtService.sign({
        username: user.username,
        id_user: user.id,
        name: profile?.firstname ?? null,
      }),
      first_login: false,
      id: user.id,
    };
  }

  /**
   * Persists the profile data collected in step 1 of the first-login wizard.
   * Only fields actually sent by the client are written.
   */
  private async saveFirstLoginProfile(
    id_user: number,
    dto: FirstLoginDto,
    avatar?: UploadedFile,
  ): Promise<Profile | null> {
    const changes: Record<string, any> = {};

    const firstname = dto.firstname?.trim();
    if (firstname) changes.firstname = firstname;

    const lastname = dto.lastname?.trim();
    if (lastname) changes.lastname = lastname;

    const phone = dto.phone?.trim();
    if (phone) changes.phone = phone;

    const id_gender = Number.parseInt(dto.gender ?? '', 10);
    if (Number.isFinite(id_gender)) changes.id_gender = id_gender;

    const image = await this.storeProfileImage(id_user, dto.src, avatar);
    if (image) changes.image = image;

    let profile = await this.profileModel.findOne({ where: { id_user } });

    if (!profile) {
      profile = await this.profileModel.create({
        id_user,
        firstname: changes.firstname ?? '',
        lastname: changes.lastname ?? '',
        id_gender: changes.id_gender ?? null,
        phone: changes.phone ?? '',
        image: changes.image ?? '',
      } as any);
      return profile;
    }

    if (Object.keys(changes).length) {
      changes.updated_at = new Date();
      await profile.update(changes);
    }

    return profile;
  }

  /**
   * Resolves the value stored in `profiles.image`.
   *
   * An uploaded file (or a data-URL preview when the browser sent no file part)
   * is written to `files/profile_images/` and the stored value is the filename,
   * which the frontend resolves against `/files/profile_images/<name>`.
   * A plain string such as `User-Male.svg` is stored as-is.
   */
  private async storeProfileImage(
    id_user: number,
    src?: string,
    avatar?: UploadedFile,
  ): Promise<string | null> {
    const MAX_BYTES = 2 * 1024 * 1024;

    let buffer: Buffer | null = null;
    let extension = '';

    if (avatar?.buffer?.length) {
      if (!avatar.mimetype?.startsWith('image/')) {
        throw new BadRequestException({
          title: 'Archivo no válido',
          message: 'La foto de perfil debe ser una imagen.',
          status: 400,
          code: 'image',
        });
      }
      buffer = avatar.buffer;
      extension =
        extname(avatar.originalname ?? '').toLowerCase() ||
        `.${avatar.mimetype.split('/')[1]}`;
    } else if (src?.startsWith('data:image/')) {
      const match = /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/.exec(src);
      if (!match) return null;
      buffer = Buffer.from(match[2], 'base64');
      extension = `.${match[1]}`;
    } else {
      const plain = src?.trim();
      return plain ? plain : null;
    }

    if (buffer.length > MAX_BYTES) {
      throw new BadRequestException({
        title: 'Archivo demasiado grande',
        message: 'La foto de perfil no puede superar los 2 MB.',
        status: 400,
        code: 'image',
      });
    }

    const filename = `profile-${id_user}-${Date.now()}${extension}`;
    await fs.mkdir(PROFILE_IMAGES_DIR, { recursive: true });
    await fs.writeFile(join(PROFILE_IMAGES_DIR, filename), buffer);
    return filename;
  }
}
