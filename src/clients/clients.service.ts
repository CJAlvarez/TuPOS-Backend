import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Op } from 'sequelize';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { UtilsService } from 'src/utils/utils.service';
import { JobsService } from 'src/jobs/jobs.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Profile) private readonly profileModel: typeof Profile,
    private readonly jobsService: JobsService,
    private readonly utilsService: UtilsService,
    private readonly sequelize: Sequelize,
  ) {}

  async getClients(query: GetClientsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;

    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { '$profile.identification$': { [Op.like]: `%${search_word}%` } },
        { '$profile.phone$': { [Op.like]: `%${search_word}%` } },
        { '$user.email$': { [Op.like]: `%${search_word}%` } },
        this.sequelize.literal(
          `MATCH(profile.firstname, profile.lastname) AGAINST('${search_word.trim().replace(/'/g, "''")}' IN BOOLEAN MODE)`,
        ),
      ];
    }

    const total = await this.clientModel.count({
      include: [
        { model: User, as: 'user', required: true },
        { model: Profile, as: 'profile', required: true },
      ],
      where,
    });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.clientModel.findAll({
      include: [
        { model: User, as: 'user', required: true },
        { model: Profile, as: 'profile', required: true },
      ],
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

  async getClientDetail(id: number) {
    const client = await this.clientModel.findOne({
      where: { id_user: id },
      include: [
        { model: this.userModel, as: 'user', required: true },
        { model: this.profileModel, as: 'profile', required: true },
      ],
    });
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return client;
  }

  async insertClient(
    createClientDto: CreateClientDto,
    id_store: number,
    id_user: number,
  ) {
    const { user, profile } = createClientDto;
    if (!user || !profile) throw new Error('Datos incompletos');
    if (
      !profile.firstname ||
      !profile.lastname ||
      !profile.id_country ||
      !profile.identification ||
      !profile.id_gender
    ) {
      throw new Error('Faltan campos obligatorios');
    }
    // Validar usuario único por identificación y país
    const existingProfile = await this.profileModel.findOne({
      where: {
        identification: profile.identification.replace(/-/g, ''),
        id_country: profile.id_country,
      },
      include: [
        {
          model: this.clientModel,
          as: 'client',
          where: { id_store },
          required: true,
        },
      ],
    });
    if (existingProfile)
      throw new Error(
        'Ya existe un usuario con esa identificación y país en esta tienda',
      );

    if (user.email) {
      // Validar usuario único por email
      const existingUser = await this.userModel.findOne({
        where: { email: user.email },
        include: [
          {
            model: this.clientModel,
            as: 'client',
            where: { id_store },
            required: true,
          },
        ],
      });
      if (existingUser)
        throw new Error('Ya existe un usuario con ese email en esta tienda');
    }

    // Crear usuario
    const newUser = await this.userModel.create({
      ...user,
      firstLogin: true,
      steps2: false,
      created_by: id_user,
    } as any);
    // Crear cliente
    await this.clientModel.create({
      id_user: newUser.id,
      id_store,
    } as any);
    // Crear perfil (sin enviar created_at ni updated_at)
    await this.profileModel.create({ ...profile, id_user: newUser.id } as any);
    return {
      title: 'Operación Exitosa',
      message: 'El cliente ha sido creado.',
      id_user: newUser.id,
    };
  }

  async updateClient(updateClientDto: UpdateClientDto) {
    const client = await this.clientModel.findOne({
      where: { id_user: updateClientDto.user.id },
    });
    if (!client) throw new Error('Cliente no encontrado');
    // Actualizar usuario si corresponde
    if (updateClientDto.user) {
      await this.userModel.update(updateClientDto.user, {
        where: { id: updateClientDto.user.id },
      });
    }
    // Actualizar perfil si corresponde
    if (updateClientDto.profile) {
      await this.profileModel.update(updateClientDto.profile, {
        where: { id_user: updateClientDto.user.id },
      });
    }
    return {
      title: 'Operación Exitosa',
      message: 'El cliente ha sido actualizado.',
    };
  }

  async updateClientStatus(
    internal_user_id: number,
    body: UpdateClientStatusDto,
  ) {
    if (
      !body ||
      typeof body.id !== 'number' ||
      typeof body.enable !== 'boolean'
    ) {
      throw {
        title: 'Operación No Permitida',
        message: 'Datos incompletos.',
        status: 400,
      };
    }
    await this.clientModel.update(
      {
        disabled_at: body.enable ? null : new Date(),
        disabled_by: body.enable ? null : internal_user_id,
      },
      { where: { id_user: body.id } },
    );
    // Obtener datos de usuario y perfil
    const user = await this.userModel.findOne({ where: { id: body.id } });
    const profile = await this.profileModel.findOne({
      where: { id_user: body.id },
    });
    if (user && profile) {
      await this.jobsService.addJob({
        type: 'sendEmailTemplate',
        data: {
          to: user.email,
          subject: body.enable ? 'Usuario Habilitado' : 'Usuario Deshabilitado',
          replacements: {
            logo_dark: 'https://tuposhn.com/assets/images/logo-dark2-sm.png',
            logo_light:
              'https://tuposhn.com/assets/images/logotipo-blanco.png',
            content: [
              {
                type: 'normal',
                text: `Hola, ${profile.firstname} ${profile.lastname}`,
              },
              { type: 'skip' },
              {
                type: 'normal',
                text: `Tu acceso a la plataforma de Clientes ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'} por un Administrador.`,
              },
              { type: 'skip' },
              {
                type: 'small',
                text: 'Para mayor información contáctate con nosotros.',
              },
            ],
          },
        },
      });
    }
    return {
      title: 'Operación Exitosa',
      message: `El cliente ha sido ${body.enable ? 'Habilitado' : 'Deshabilitado'}.`,
    };
  }

  async findByUserId(id_user: number) {
    return this.getClientDetail(id_user);
  }
}
