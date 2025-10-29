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
  tableName: 'sales',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Sale extends Model<Sale> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_client?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_payment_method: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_status: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_invoice: number;

  @Column({ type: DataType.STRING, allowNull: false })
  number: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  discount_total: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  tax_total: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  total: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  notes: string;

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

export interface SaleCreationAttributes {
  id_user: number;
  id_client: number;
  id_payment_method: number;
  total: number;
  date: Date;
  id_status: number;
  id_invoice?: number;
  number: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  is_status: boolean;
  notes?: string;
}
