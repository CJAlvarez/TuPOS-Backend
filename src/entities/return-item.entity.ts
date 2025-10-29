import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Return } from './return.entity';

@Table({
  tableName: 'return_items',
  timestamps: false,
})
export class ReturnItem extends Model<ReturnItem> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @ForeignKey(() => Return)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_return: number;

  @BelongsTo(() => Return)
  return: Return;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_product: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_sale_item: number;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number | null;
}

export interface ReturnItemCreationAttributes {
  id_return: number;
  id_product: number;
  id_sale_item: number;
}
