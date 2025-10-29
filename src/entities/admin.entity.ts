import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from './user.entity';
import { Profile } from './profile.entity';

export interface AdminCreationAttributes {
  id_user: number;
  id_admin_type: number;
}

@Table({ tableName: 'admins', timestamps: false })
export class Admin extends Model<Admin, AdminCreationAttributes> {
  @HasOne(() => Profile, { foreignKey: 'id_user', as: 'profile' })
  profile?: Profile;

  @BelongsTo(() => User, 'id_user')
  user?: User;

  @Column({ type: DataType.INTEGER, primaryKey: true })
  id_user: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_admin_type: number;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by: number;
}
