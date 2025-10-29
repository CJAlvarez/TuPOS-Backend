import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignsQueryDto } from './dto/get-campaigns-query.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { Campaign } from '../entities/campaign.entity';
import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private readonly campaignService;
    constructor(campaignService: CampaignService);
    findAll(req: any, query: GetCampaignsQueryDto): Promise<any>;
    findOne(id: string): Promise<Campaign | null>;
    create(req: any, data: CreateCampaignDto): Promise<Campaign>;
    update(dto: UpdateCampaignDto): Promise<[number, Campaign[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateCampaignStatusDto): Promise<[number, Campaign[]]>;
}
