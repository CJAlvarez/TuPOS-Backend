import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'gift_card_transactions',
  timestamps: false,
})
export class GiftCardTransaction extends Model<GiftCardTransaction> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_gift_card: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_sale: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_type: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
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

export interface GiftCardTransactionCreationAttributes {
  id_gift_card: number;
  id_sale?: number;
  id_type: number;
  amount: number;
  created_at?: Date;
}