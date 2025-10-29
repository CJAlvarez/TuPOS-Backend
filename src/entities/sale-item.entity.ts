import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from './product.entity';

@Table({
  tableName: 'sale_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SaleItem extends Model<SaleItem> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_sale: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_product: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  price: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  discount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  tax: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  total: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number | null;
}

export interface SaleItemCreationAttributes {
  id_sale: number;
  id_product: number;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}
