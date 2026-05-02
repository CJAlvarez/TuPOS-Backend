import { DiscountRule } from '../entities/discount-rule.entity';
import { CreateDiscountRuleDto } from './dto/create-discount-rule.dto';
import { UpdateDiscountRuleDto } from './dto/update-discount-rule.dto';
import { GetDiscountRulesQueryDto } from './dto/get-discount-rules-query.dto';
import { UpdateDiscountRuleStatusDto } from './dto/update-discount-rule-status.dto';
import { UtilsService } from 'src/utils/utils.service';
export declare class DiscountRuleService {
    private readonly discountRuleModel;
    private readonly utilsService;
    constructor(discountRuleModel: typeof DiscountRule, utilsService: UtilsService);
    findAll(query: GetDiscountRulesQueryDto, id_store?: number): Promise<{
        count: number;
        list: DiscountRule[];
        skip: number;
    }>;
    findOne(id: number, storeId: number): Promise<DiscountRule | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateDiscountRuleDto): Promise<DiscountRule>;
    update(dto: UpdateDiscountRuleDto, storeId: number): Promise<[number, DiscountRule[]]>;
    remove(internal_user_id: number, id: number, storeId: number): Promise<any>;
    updateStatus(internal_user_id: number, dto: UpdateDiscountRuleStatusDto, storeId: number): Promise<[number, DiscountRule[]]>;
}
