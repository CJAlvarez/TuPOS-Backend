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
  tableName: 'campaigns',
  timestamps: false,
})
export class Campaign extends Model<Campaign> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_type: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active: boolean;

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

export interface CampaignCreationAttributes {
  id_type: number;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  active?: boolean;
  created_at?: Date;
}