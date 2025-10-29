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
  tableName: 'royalties',
  timestamps: false,
})
export class Royalty extends Model<Royalty> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_client: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_sale: number;
  
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_status: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  points: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  created_by: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  created_at: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  expire_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disabled_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  disabled_by?: number | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deleted_at?: Date | null;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number | null;
}

export interface RoyaltyCreationAttributes {
  id_client: number;
  id_sale: number;
  id_status: number;
  points: number;
  created_by: number;
  created_at?: Date;
  expire_at: Date;
}
