import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Terminal } from '../entities/terminal.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { GetTerminalsQueryDto } from './dto/get-terminals-query.dto';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { Op } from 'sequelize';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class TerminalService {
  constructor(
    @InjectModel(Terminal)
    private readonly terminalModel: typeof Terminal,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll(query: GetTerminalsQueryDto, id_store?: number) {
    const { search_word, limit = 10, skip = 0 } = query;
    const where: any = {};
    if (id_store) where.id_store = id_store;
    if (search_word) {
      where[Op.or] = [
        { $name$: { [Op.like]: `%${search_word}%` } },
        { $code$: { [Op.like]: `%${search_word}%` } },
        { $device$: { [Op.like]: `%${search_word}%` } },
      ];
    }
    const total = await this.terminalModel.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.terminalModel.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
    });
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number): Promise<Terminal | null> {
    return this.terminalModel.findOne({ where: { id } });
  }

  async create(
    internal_user_id: number,
    internal_store_id: number,
    dto: CreateTerminalDto,
  ): Promise<Terminal> {
    dto.created_by = internal_user_id;
    dto.id_store = internal_store_id;
    return this.terminalModel.create(dto as any);
  }

  async update(
    dto: UpdateTerminalDto,
  ): Promise<[number, Terminal[]]> {
    return this.terminalModel.update(dto, { where: { id: dto.id }, returning: true });
  }

  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.terminalModel.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      },
      {
        where: {
          id,
          deleted_at: { [Op.is]: null },
        },
      },
    );
    return affectedRows;
  }

  async updateStatus(
    internal_user_id: number,
    dto: UpdateTerminalStatusDto,
  ): Promise<[number, Terminal[]]> {
    return this.terminalModel.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      },
      { where: { id: dto.id }, returning: true },
    );
  }
}
