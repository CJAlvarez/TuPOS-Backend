import { Royalty } from '../entities/royalty.entity';
import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { GetRoyaltiesQueryDto } from './dto/get-royalties-query.dto';
import { UpdateRoyaltyStatusDto } from './dto/update-royalty-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class RoyaltyService {
    private readonly royaltyModel;
    private readonly utilsService;
    constructor(royaltyModel: typeof Royalty, utilsService: UtilsService);
    findAll(query: GetRoyaltiesQueryDto, id_store?: number): Promise<{
        count: number;
        list: Royalty[];
        skip: number;
    }>;
    findOne(id: number): Promise<Royalty | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateRoyaltyDto): Promise<Royalty>;
    update(dto: UpdateRoyaltyDto): Promise<[number, Royalty[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateRoyaltyStatusDto): Promise<[number, Royalty[]]>;
}
