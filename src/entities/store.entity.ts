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
  tableName: 'stores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Store extends Model<Store> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 1 })
  id_loyalty_type: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  loyalty_value: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 1 })
  tax_included: number;

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

export interface StoreCreationAttributes {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}
