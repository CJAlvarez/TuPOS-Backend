import { Table, Column, Model, DataType, CreatedAt, BelongsTo } from 'sequelize-typescript';

@Table({ tableName: 'invoices', timestamps: false })
export class Invoice extends Model<Invoice> {

  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_user: number;

  @Column({ type: DataType.STRING, allowNull: false })
  number: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  client: string;

  @Column({ type: DataType.STRING, allowNull: true })
  store_name?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  town?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  department?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  date?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  items?: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  total: number;

  @Column({ type: DataType.STRING, allowNull: true })
  phone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  ref?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  file?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true })
  created_at?: Date;
}
