import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'notifications',
  timestamps: false,
})
export class Notification extends Model<Notification> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_status: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_type: number;

  @Column({ type: DataType.STRING, allowNull: false })
  subject: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  created_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  seen_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  seen_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  archived_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  archived_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by: number;
}

export interface NotificationCreationAttributes {
  id_status: number;
  id_type: number;
  subject: string;
  content: string;
  created_at?: Date;
  created_by: number;
  seen_at?: Date;
  archived_at?: Date;
  deleted_at?: Date;
}
