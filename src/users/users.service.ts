import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { Profile } from '../entities/profile.entity';
import { Admin } from '../entities/admin.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnableUserDto } from './dto/enable-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';
import * as bcrypt from 'bcrypt';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Client)
    private readonly clientModel: typeof Client,
    @InjectModel(Profile)
    private readonly profileModel: typeof Profile,
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
    private readonly jobsService: JobsService,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(
    query: any,
  ): Promise<{ count: number; list: User[]; skip: number }> {
    // Filtros y paginación
    const { email, firstname, lastname, skip = 0, take = 20 } = query;
    const where: any = {};
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (firstname) where.firstname = { [Op.iLike]: `%${firstname}%` };
    if (lastname) where.lastname = { [Op.iLike]: `%${lastname}%` };
    const { count, rows } = await this.userModel.findAndCountAll({
      where,
      offset: Number(skip),
      limit: Number(take),
    });
    return { count, list: rows, skip: Number(skip) };
  }

  async create(internal_user_id: any, dto: CreateUserDto): Promise<User> {
    // Validar unicidad de email
    const existing = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }
    if (!dto.password) {
      throw new BadRequestException('La contraseña es obligatoria');
    }
    // Crear usuario con campos reales de la tabla
    const user = await this.userModel.create({
      username: dto.email, // o usa dto.username si lo tienes en el DTO
      password: dto.password,
      email: dto.email,
      firstLogin: true,
      steps2: false,
      created_by: internal_user_id,
    } as any); // Cast para evitar error de tipado estricto
    // Crear cliente asociado (requiere id del usuario)
    const client = this.clientModel.build({ id_user: user.id });
    await client.save();
    // Crear admin si es tipo admin
    if (dto.id_admin_type === 1) {
      const admin = this.adminModel.build({
        id_user: user.id,
        id_admin_type: 1,
      });
      await admin.save();
    }
    // Crear profile
    const profile = this.profileModel.build({
      id_user: user.id,
      firstname: dto.firstname,
      lastname: dto.lastname,
      id_gender: dto.id_gender,
      id_country: dto.id_country,
      phone: dto.phone,
      identification: dto.identification,
      address: '',
      image: '',
    });
    await profile.save();
    await this.jobsService.addJob({
      type: 'sendEmail',
      data: {
        to: user.email,
        subject: 'Bienvenido a la plataforma',
        html: `<p>Hola ${dto.firstname}, tu usuario ha sido creado correctamente.</p>`,
      },
    });
    return user;
  }

  async update(internal_user_id: number, dto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findByPk(internal_user_id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const updatedUser = await user.update({
      email: dto.email,
    } as any);

    const profile = await this.profileModel.findOne({
      where: { id_user: internal_user_id },
    });
    if (profile) {
      await profile.update({
        firstname: dto.firstname,
        lastname: dto.lastname,
        id_gender: dto.id_gender,
        id_country: dto.id_country,
        phone: dto.phone,
        identification: dto.identification,
        updated_at: new Date(),
      });
    }
    const admin = await this.adminModel.findByPk(internal_user_id);
    if (admin && dto.id_admin_type) {
      await admin.update({ id_admin_type: dto.id_admin_type });
    }
    return {
      title: 'Operación Exitosa',
      message: 'Su perfil ha sido actualizado.',
    };
  }

  async remove(
    internal_user_id: any,
    dto: DeleteUserDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(dto.id_user);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    // Ajustar campo de soft delete según entidad (disabledAt)
    await user.update({ disabledAt: new Date(), disabledBy: internal_user_id });
    // Soft delete en client
    const client = await this.clientModel.findByPk(user.id);
    if (client)
      await client.update({
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      });
    // Soft delete en admin
    const admin = await this.adminModel.findByPk(user.id);
    if (admin)
      await admin.update({
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      });
    // Soft delete en profile (solo updated_at)
    const profile = await this.profileModel.findOne({
      where: { id_user: user.id },
    });
    if (profile) await profile.update({ updated_at: new Date() });
    return { message: 'Usuario eliminado' };
  }

  async setEnableUser(
    internal_user_id: any,
    dto: EnableUserDto,
  ): Promise<{ message: string }> {
    const admin = await this.adminModel.findByPk(dto.id_user);
    if (!admin) throw new NotFoundException('Admin no encontrado');
    await admin.update({
      disabled_at: dto.enable ? undefined : new Date(),
      disabled_by: internal_user_id,
    });
    return {
      message: `Usuario ${dto.enable ? 'habilitado' : 'deshabilitado'}`,
    };
  }

  async setUserAdmin(id_user: number): Promise<{ message: string }> {
    const exists = await this.adminModel.findByPk(id_user);
    if (exists) return { message: 'Ya es admin' };
    await this.adminModel.create({ id_user, id_admin_type: 1 } as any);
    return { message: 'Usuario convertido a admin' };
  }

  async setUserClient(id_user: number): Promise<{ message: string }> {
    const exists = await this.clientModel.findByPk(id_user);
    if (exists) return { message: 'Ya es client' };
    await this.clientModel.create({ id_user } as any);
    return { message: 'Usuario convertido a client' };
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
    const client = await this.clientModel.findByPk(id_user);
    return {
      admin: !!admin,
      client: !!client,
    };
  }
}
