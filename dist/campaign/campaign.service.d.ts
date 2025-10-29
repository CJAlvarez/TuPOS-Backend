import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignsQueryDto } from './dto/get-campaigns-query.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class CampaignService {
    private readonly campaignModel;
    private readonly utilsService;
    constructor(campaignModel: typeof Campaign, utilsService: UtilsService);
    findAll(query: GetCampaignsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Campaign[];
        skip: number;
    }>;
    findOne(id: number): Promise<Campaign | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateCampaignDto): Promise<Campaign>;
    update(dto: UpdateCampaignDto): Promise<[number, Campaign[]]>;
    remove(internal_user_id: number, id: number): Promise<number>;
    updateStatus(internal_user_id: number, dto: UpdateCampaignStatusDto): Promise<[number, Campaign[]]>;
}
