import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  // Agrega más campos según el modelo original
}
