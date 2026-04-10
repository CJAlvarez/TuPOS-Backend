import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';
import { UtilsService } from 'src/utils/utils.service';
import { JobsService } from 'src/jobs/jobs.service';
import { Sequelize } from 'sequelize-typescript';
import { RoyaltyService } from 'src/royalty/royalty.service';
export declare class ClientsService {
    private readonly clientModel;
    private readonly userModel;
    private readonly profileModel;
    private readonly jobsService;
    private readonly utilsService;
    private readonly royaltyService;
    private readonly sequelize;
    constructor(clientModel: typeof Client, userModel: typeof User, profileModel: typeof Profile, jobsService: JobsService, utilsService: UtilsService, royaltyService: RoyaltyService, sequelize: Sequelize);
    getClients(query: GetClientsQueryDto, id_store?: number): Promise<{
        count: number;
        list: {
            loyalty_points: number;
            profile?: Profile;
            user?: User;
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
            _attributes: Client;
            dataValues: Client;
            _creationAttributes: import("../entities/client.entity").ClientCreationAttributes;
            isNewRecord: boolean;
            sequelize: import("sequelize").Sequelize;
            _model: import("sequelize").Model<Client, import("../entities/client.entity").ClientCreationAttributes>;
        }[];
        skip: number;
    }>;
    getClientDetail(id: number): Promise<Client>;
    insertClient(createClientDto: CreateClientDto, id_store: number, id_user: number): Promise<{
        title: string;
        message: string;
        id_user: number;
    }>;
    updateClient(updateClientDto: UpdateClientDto): Promise<{
        title: string;
        message: string;
    }>;
    updateClientStatus(internal_user_id: number, body: UpdateClientStatusDto): Promise<{
        title: string;
        message: string;
    }>;
    findByUserId(id_user: number): Promise<Client>;
}
