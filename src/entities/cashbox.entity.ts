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
  tableName: 'cashboxes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Cashbox extends Model<Cashbox> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  opening_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  closing_amount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  opened_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  opened_by: number;

  @Column({ type: DataType.DATE, allowNull: true })
  closed_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  closed_by: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by: number;

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

export interface CashboxCreationAttributes {
  opening_amount: number;
  closing_amount?: number;
  created_by: number;
  opened_at: Date;
  closed_at?: Date;
}
