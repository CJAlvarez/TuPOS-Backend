import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'catalog_versions',
  timestamps: false,
})
export class CatalogVersion extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  declare key: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'catalog_version', // Evita conflicto con Sequelize
  })
  declare catalog_version: Date;
}
