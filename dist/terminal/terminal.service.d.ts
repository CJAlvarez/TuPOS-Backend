import { Terminal } from '../entities/terminal.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { GetTerminalsQueryDto } from './dto/get-terminals-query.dto';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class TerminalService {
    private readonly terminalModel;
    private readonly utilsService;
    constructor(terminalModel: typeof Terminal, utilsService: UtilsService);
    findAll(query: GetTerminalsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Terminal[];
        skip: number;
    }>;
    findOne(id: number): Promise<Terminal | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateTerminalDto): Promise<Terminal>;
    update(dto: UpdateTerminalDto): Promise<[number, Terminal[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateTerminalStatusDto): Promise<[number, Terminal[]]>;
}
