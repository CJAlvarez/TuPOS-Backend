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
  tableName: 'reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Report extends Model<Report> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  code: string;

  @Column({
    type: DataType.ENUM('PREPROCESSED', 'IMMEDIATE'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    comment: 'Patrón de frecuencia: H24=24hrs, D7=7días, W1=semanal, M1=mensual, Y1=anual',
  })
  frequency_pattern: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Última ejecución del reporte',
  })
  last_execution: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Parámetros de configuración del reporte',
  })
  parameters: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'Últimos resultados para reportes preprocesados',
  })
  last_results: any;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
