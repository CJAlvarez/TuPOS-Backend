import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  HasMany,
} from 'sequelize-typescript';
import { ReturnItem } from './return-item.entity';

@Table({
  tableName: 'returns',
  timestamps: false,
})
export class Return extends Model<Return> {
  @HasMany(() => ReturnItem)
  return_items: ReturnItem[];

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_sale: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_client?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_terminal?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_invoice?: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  total: number;

  @Column({ type: DataType.STRING, allowNull: true })
  reason: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number | null;
}

export interface ReturnCreationAttributes {
  id_sale: number;
  id_client: number;
  id_terminal: number;
  id_invoice: number;
  date: Date;
  total: number;
  reason?: string;
  created_by: number;
  created_at?: Date;
}
