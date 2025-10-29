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
  tableName: 'discount_rules',
  timestamps: false,
})
export class DiscountRule extends Model<DiscountRule> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_type: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  value: number;

  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  min_quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_product: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_category: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_client: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_campaign: number;

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

export interface DiscountRuleCreationAttributes {
  name: string;
  description?: string;
  id_type: number;
  value: number;
  start_date: Date;
  end_date: Date;
  min_quantity?: number;
  id_product?: number;
  id_category?: number;
  id_client?: number;
  id_campaign?: number;
  created_by: number;
  created_at?: Date;
}
