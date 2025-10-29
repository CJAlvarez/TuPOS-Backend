import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'invoice_config', timestamps: false })
export class InvoiceConfig extends Model<InvoiceConfig> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_store: number;

  @ApiProperty()
  @Column({ type: DataType.JSON })
  config: any;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  printer_ip: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  printer_port: string;
}
