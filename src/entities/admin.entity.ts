import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { Store } from './store.entity';

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

  @BelongsTo(() => Store, { foreignKey: 'id_store', targetKey: 'id' })
  store?: Store;

  @Column({ type: DataType.INTEGER, primaryKey: true })
  id_user: number;

  @ForeignKey(() => Store)
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
