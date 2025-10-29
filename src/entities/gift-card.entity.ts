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
  tableName: 'gift_cards',
  timestamps: true,
  createdAt: 'issued_at',
  updatedAt: false,
})
export class GiftCard extends Model<GiftCard> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  initial_balance: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  current_balance: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_client: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @CreatedAt
  @Column({ field: 'issued_at', type: DataType.DATE })
  issued_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  expires_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number | null;
}

export interface GiftCardCreationAttributes {
  code: string;
  initial_balance: number;
  current_balance: number;
  id_client?: number;
  active?: boolean;
  issued_at?: Date;
  expires_at?: Date;
}