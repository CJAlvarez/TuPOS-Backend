import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Client } from './client.entity';
import { Admin } from './admin.entity';

export interface ProfileCreationAttributes {
  id_user: number;
  firstname: string;
  lastname: string;
  id_gender: number;
  id_country: number;
  phone: string;
  identification: string;
  address?: string;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: 'profiles', timestamps: false })
export class Profile extends Model<Profile, ProfileCreationAttributes> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id_profile: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  id_user: number;

  @BelongsTo(() => User, 'id_user')
  user?: User;

  @BelongsTo(() => Client, 'id_user')
  client?: Client;

  @BelongsTo(() => Admin, 'id_user')
  admin?: Admin;

  @Column({ type: DataType.STRING })
  firstname: string;

  @Column({ type: DataType.STRING })
  lastname: string;

  @Column({ type: DataType.INTEGER })
  id_gender: number;

  @Column({ type: DataType.INTEGER })
  id_country: number;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.STRING })
  identification: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  created_at: Date;

  @Column({ type: DataType.DATE })
  updated_at: Date;
}
