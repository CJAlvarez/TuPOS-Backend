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
  tableName: 'terminals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Terminal extends Model<Terminal> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_store: number;

  @Column({ type: DataType.STRING, allowNull: false })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  id_address: number;

  @Column({ type: DataType.STRING, allowNull: false })
  device: string;

  @Column({ type: DataType.DATE, allowNull: true })
  last_sync: Date;

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

export interface TerminalCreationAttributes {
  id_store: number;
  code: string;
  name: string;
  id_address: number;
  device: string;
  last_sync?: Date;
}
