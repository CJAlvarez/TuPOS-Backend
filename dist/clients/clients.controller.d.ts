import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    getClients(req: any, query: GetClientsQueryDto): Promise<{
        count: number;
        list: import("../entities/client.entity").Client[];
        skip: number;
    }>;
    getClientDetail(id: number): Promise<import("../entities/client.entity").Client>;
    insertClient(req: any, createClientDto: CreateClientDto): Promise<{
        title: string;
        message: string;
        id_user: number;
    }>;
    updateClient(updateClientDto: UpdateClientDto): Promise<{
        title: string;
        message: string;
    }>;
    updateClientStatus(req: any, body: UpdateClientStatusDto): Promise<{
        title: string;
        message: string;
    }>;
}
