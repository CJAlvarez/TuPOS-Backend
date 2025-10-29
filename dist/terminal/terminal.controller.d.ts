import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { GetTerminalsQueryDto } from './dto/get-terminals-query.dto';
import { UpdateTerminalStatusDto } from './dto/update-terminal-status.dto';
import { Terminal } from 'src/entities/terminal.entity';
import { TerminalService } from './terminal.service';
export declare class TerminalController {
    private readonly terminalService;
    constructor(terminalService: TerminalService);
    findAll(req: any, query: GetTerminalsQueryDto): Promise<any>;
    findOne(id: string): Promise<Terminal | null>;
    create(req: any, data: CreateTerminalDto): Promise<Terminal>;
    update(dto: UpdateTerminalDto): Promise<[number, Terminal[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateTerminalStatusDto): Promise<[number, Terminal[]]>;
}
