import { CreateDiscountRuleDto } from './dto/create-discount-rule.dto';
import { UpdateDiscountRuleDto } from './dto/update-discount-rule.dto';
import { GetDiscountRulesQueryDto } from './dto/get-discount-rules-query.dto';
import { UpdateDiscountRuleStatusDto } from './dto/update-discount-rule-status.dto';
import { DiscountRule } from '../entities/discount-rule.entity';
import { DiscountRuleService } from './discount-rule.service';
export declare class DiscountRuleController {
    private readonly discountRuleService;
    constructor(discountRuleService: DiscountRuleService);
    findAll(req: any, query: GetDiscountRulesQueryDto): Promise<any>;
    findOne(id: string): Promise<DiscountRule | null>;
    create(req: any, data: CreateDiscountRuleDto): Promise<DiscountRule>;
    update(dto: UpdateDiscountRuleDto): Promise<[number, DiscountRule[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateDiscountRuleStatusDto): Promise<[number, DiscountRule[]]>;
}
