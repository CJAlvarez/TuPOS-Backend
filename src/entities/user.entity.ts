import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  HasOne,
} from 'sequelize-typescript';
import { Profile } from './profile.entity';
import { Client } from './client.entity';
import { Admin } from './admin.entity';

export interface UserCreationAttributes {
  username: string;
  password: string;
  email: string;
  createdAt?: Date;
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @HasOne(() => Profile, { foreignKey: 'id_user', as: 'profile' })
  profile?: Profile;

  @HasOne(() => Client, { foreignKey: 'id_user', as: 'client' })
  client?: Client;

  @HasOne(() => Admin, { foreignKey: 'id_user', as: 'admin' })
  admin?: Admin;

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_user',
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
   username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
   password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
   email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'restore_code',
  })
   restoreCode: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'first_login',
    defaultValue: false,
  })
   firstLogin: boolean | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'steps_2',
    defaultValue: false,
  })
   steps2: boolean | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
   createdBy: number | null;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'created_at',
  })
  declare createdAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'disabled_at',
  })
  declare disabledAt: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'disabled_by',
  })
  declare disabledBy: number | null;
}
