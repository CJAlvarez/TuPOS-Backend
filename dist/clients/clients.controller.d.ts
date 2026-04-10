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
        list: {
            loyalty_points: number;
            profile?: import("../entities/profile.entity").Profile;
            user?: import("../entities/user.entity").User;
            id_user: number;
            id_store: number;
            loyalty_eligible: number;
            disabled_at?: Date | null;
            disabled_by?: number | null;
            deleted_at?: Date;
            deleted_by?: number;
            id?: number | any;
            createdAt?: Date | any;
            updatedAt?: Date | any;
            deletedAt?: Date | any;
            version?: number | any;
            _attributes: import("../entities/client.entity").Client;
            dataValues: import("../entities/client.entity").Client;
            _creationAttributes: import("../entities/client.entity").ClientCreationAttributes;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<import("../entities/client.entity").Client, import("../entities/client.entity").ClientCreationAttributes>;
        }[];
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
