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

export interface ClientCreationAttributes {
  id_user: number;
  // Agrega aquí otros campos obligatorios si existen
}

@Table({ tableName: 'clients', timestamps: false })
export class Client extends Model<Client, ClientCreationAttributes> {
  @HasOne(() => Profile, { foreignKey: 'id_user', as: 'profile' })
  profile?: Profile;

  @BelongsTo(() => User, 'id_user')
  user?: User;

  @Column({ type: DataType.INTEGER, primaryKey: true })
  id_user: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 2 })
  loyalty_eligible: number;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;
}
