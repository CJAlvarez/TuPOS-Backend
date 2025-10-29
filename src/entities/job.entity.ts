import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'jobs',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  initialAutoIncrement: '1',
})
export class Job extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  type: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  data: any;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  status: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at: Date;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  completed_at?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  deleted_at?: Date;
}
