import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UtilsService } from 'src/utils/utils.service';
import * as bcrypt from 'bcrypt';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Profile)
    private readonly profileModel: typeof Profile,
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
    private readonly jobsService: JobsService,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(
    query: GetUsersQueryDto,
  ): Promise<{ count: number; list: any[]; skip: number }> {
    const { search_word, limit = 10, skip = 0 } = query;

    const where: any = {};
    if (search_word) {
      where[Op.or] = [
        { '$profile.identification$': { [Op.like]: `%${search_word}%` } },
        { '$profile.phone$': { [Op.like]: `%${search_word}%` } },
        { '$user.email$': { [Op.like]: `%${search_word}%` } },
        this.sequelize.literal(
          `MATCH(profile.firstname, profile.lastname) AGAINST('${search_word
            .trim()
            .replace(/'/g, "''")}' IN BOOLEAN MODE)`,
        ),
      ];
    }

    const include = [
      {
        model: User,
        as: 'user',
        required: true,
        attributes: { exclude: ['password'] },
      },
      { model: Profile, as: 'profile', required: true },
    ];

    const total = await this.adminModel.count({ include, where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.adminModel.findAll({
      include,
      where,
      limit: paginate.limit,
      offset: paginate.offset,
    });

    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async create(internal_user_id: any, dto: CreateUserDto): Promise<any> {
    const { user, profile, id_admin_type } = dto;
    if (!user || !profile) throw new BadRequestException('Datos incompletos');
    if (!user.password) {
      throw new BadRequestException('La contraseña es obligatoria');
    }
    // Email uniqueness
    const existing = await this.userModel.findOne({
      where: { email: user.email },
    });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userModel.create({
      username: user.email,
      password: hashedPassword,
      email: user.email,
      firstLogin: true,
      steps2: false,
      created_by: internal_user_id,
    } as any);
    // Admin row (defaults to standard admin type when not provided)
    await this.adminModel.create({
      id_user: newUser.id,
      id_admin_type: id_admin_type ?? 2,
    } as any);
    // Profile row
    await this.profileModel.create({
      id_user: newUser.id,
      firstname: profile.firstname,
      lastname: profile.lastname,
      id_gender: profile.id_gender,
      id_country: profile.id_country,
      phone: profile.phone,
      identification: profile.identification,
      address: profile.address || '',
      image: profile.image || '',
    } as any);
    await this.jobsService.addJob({
      type: 'sendEmail',
      data: {
        to: newUser.email,
        subject: 'Bienvenido a la plataforma',
        html: `<p>Hola ${profile.firstname}, tu usuario administrador ha sido creado correctamente.</p>`,
      },
    });
    return {
      title: 'Operación Exitosa',
      message: 'El administrador ha sido creado.',
      id_user: newUser.id,
    };
  }

  async update(internal_user_id: number, dto: UpdateUserDto): Promise<any> {
    const id_user = dto?.user?.id;
    if (!id_user) throw new BadRequestException('Usuario no especificado');
    const user = await this.userModel.findByPk(id_user);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.user?.email) {
      await user.update({ email: dto.user.email } as any);
    }

    if (dto.profile) {
      await this.profileModel.update(
        {
          firstname: dto.profile.firstname,
          lastname: dto.profile.lastname,
          id_gender: dto.profile.id_gender,
          id_country: dto.profile.id_country,
          phone: dto.profile.phone,
          identification: dto.profile.identification,
          address: dto.profile.address,
          updated_at: new Date(),
        },
        { where: { id_user } },
      );
    }

    if (dto.id_admin_type) {
      const admin = await this.adminModel.findByPk(id_user);
      if (admin) await admin.update({ id_admin_type: dto.id_admin_type });
    }

    return {
      title: 'Operación Exitosa',
      message: 'El administrador ha sido actualizado.',
    };
  }

  async remove(
    internal_user_id: any,
    dto: DeleteUserDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(dto.id_user);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    // Soft delete on user
    await user.update({ disabledAt: new Date(), disabledBy: internal_user_id });
    // Soft delete on admin row
    const admin = await this.adminModel.findByPk(user.id);
    if (admin)
      await admin.update({
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      });
    // Touch profile
    const profile = await this.profileModel.findOne({
      where: { id_user: user.id },
    });
    if (profile) await profile.update({ updated_at: new Date() });
    return { message: 'Administrador eliminado' };
  }

  async setEnableUser(
    internal_user_id: any,
    dto: EnableUserDto,
  ): Promise<{ message: string }> {
    const admin = await this.adminModel.findByPk(dto.id_user);
    if (!admin) throw new NotFoundException('Admin no encontrado');
    await admin.update({
      disabled_at: dto.enable ? null : new Date(),
      disabled_by: dto.enable ? null : internal_user_id,
    } as any);
    return {
      message: `Usuario ${dto.enable ? 'habilitado' : 'deshabilitado'}`,
    };
  }

  async setUserStatus(
    internal_user_id: number,
    body: UpdateUserStatusDto,
  ): Promise<any> {
    if (
      !body ||
      typeof body.id !== 'number' ||
      typeof body.enable !== 'boolean'
    ) {
      throw new BadRequestException('Datos incompletos.');
    }
    const admin = await this.adminModel.findByPk(body.id);
    if (!admin) throw new NotFoundException('Admin no encontrado');
    await admin.update({
      disabled_at: body.enable ? null : new Date(),
      disabled_by: body.enable ? null : internal_user_id,
    } as any);
    return {
      title: 'Operación Exitosa',
      message: `El administrador ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'}.`,
    };
  }

  /**
   * Recovers a user's password, optionally generating a random one, updates it and sends an email notification.
   * @param id_user - User ID
   * @param options - { password?: string, secret?: boolean }
   */
  async recoverUserPassword(
    id_user: number,
    options: { password?: string; secret?: boolean },
  ): Promise<any> {
    // Validate params
    if (!id_user) throw new BadRequestException('User not selected');

    // Get user and profile data
    const user = await this.userModel.findByPk(id_user, {
      include: [{ model: this.profileModel }],
    });
    if (!user) throw new NotFoundException('User not found');

    // Generate password if secret
    let newPassword = options.password;
    if (options.secret) {
      newPassword = this.utilsService.generateToken(8, 2);
    }
    if (!newPassword) throw new BadRequestException('Password is required');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword } as any);

    await this.jobsService.addJob({
      type: 'sendEmail',
      data: {
        to: user.getDataValue('email'),
        subject: `Contraseña Restaurada por Administrador`,
        replacements: {
          logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
          logo_light: 'https://tuposhn.com/assets/images/logotipo-blanco.png',
          content: [
            {
              type: 'normal',
              text: `Hola, ${user.getDataValue('profile')?.firstname || ''} ${user.getDataValue('profile')?.lastname || ''}`,
            },
            { type: 'skip' },
            { type: 'skip' },
            {
              type: 'normal',
              text: `Tu contraseña ha sido restaurada manualmente por un Administrador.`,
            },
            { type: 'skip' },
            { type: 'skip' },
            {
              type: 'bold',
              text: 'Nueva Contraseña: ',
            },
            {
              type: 'normal',
              text: newPassword,
            },
            { type: 'skip' },
            { type: 'skip' },
            {
              type: 'small',
              text: '¿Tienes problemas iniciando sesión? Respóndenos a este mail y te ayudaremos.',
            },
          ],
        },
      },
    });

    return {
      title: 'Operación Exitosa.',
      message: `La contraseña ha sido restaurada. ${options.secret ? '' : newPassword}`,
    };
  }

  async getUserAccesses(id_user: number): Promise<any> {
    const admin = await this.adminModel.findByPk(id_user);
    return {
      admin: !!admin,
    };
  }
}
