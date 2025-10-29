import { CreateRoyaltyDto } from './dto/create-royalty.dto';
import { UpdateRoyaltyDto } from './dto/update-royalty.dto';
import { GetRoyaltiesQueryDto } from './dto/get-royalties-query.dto';
import { UpdateRoyaltyStatusDto } from './dto/update-royalty-status.dto';
import { Royalty } from '../entities/royalty.entity';
import { RoyaltyService } from './royalty.service';
export declare class RoyaltyController {
    private readonly royaltyService;
    constructor(royaltyService: RoyaltyService);
    findAll(req: any, query: GetRoyaltiesQueryDto): Promise<any>;
    findOne(id: string): Promise<Royalty | null>;
    create(req: any, data: CreateRoyaltyDto): Promise<Royalty>;
    update(dto: UpdateRoyaltyDto): Promise<[number, Royalty[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateRoyaltyStatusDto): Promise<[number, Royalty[]]>;
}
