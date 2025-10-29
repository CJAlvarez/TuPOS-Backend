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
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Payment extends Model<Payment> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_sale: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_payment_method: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: true })
  reference: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

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

export interface PaymentCreationAttributes {
  id_sale: number;
  id_payment_method: number;
  amount: number;
  reference?: string;
  date: Date;
}
