import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Product } from './product.entity';

@Table({
  tableName: 'inventorys',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_product: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column({ type: DataType.STRING, allowNull: true })
  code?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  box_quantity?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  unit_quantity: number;

  @Column({ type: DataType.DATE, allowNull: true })
  expiration_date: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

export interface InventoryCreationAttributes {
  id_store?: number;
  id_product: number;
  code?: string;
  box_quantity?: number;
  unit_quantity: number;
  expiration_date?: Date;
  created_by: number;
}
