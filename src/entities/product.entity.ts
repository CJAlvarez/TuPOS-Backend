import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { SaleItem } from './sale-item.entity';
import { Inventory } from './inventory.entity';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Product extends Model<Product> {
  @HasMany(() => SaleItem)
  saleItems: SaleItem[];

  @HasMany(() => Inventory)
  inventorys: Inventory[];

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  content: string;

  @Column({ type: DataType.STRING, allowNull: true })
  category: string;

  @Column({ type: DataType.INTEGER })
  id_type: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 2 })
  loyalty_eligible: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  min_stock: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true, defaultValue: 0 })
  tax_percent: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  unit_price: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  unit_discount_percent: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  unit_discount: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_unit_discount_type: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  box_price: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  box_discount_percent: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  box_discount: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_box_discount_type: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  box_amount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

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

export interface ProductCreationAttributes {
  id_type: number;
  name: string;
  barcode: string;
  description?: string;
  box_price: number;
  unit_price: number;
  unit_discount_percent?: number;
  unit_discount?: number;
  box_discount_percent?: number;
  box_discount?: number;
  tax_percent?: number;
  min_stock?: number;
  box_amount: number;
  loyalty_eligible: number;
  created_by: number;
}
