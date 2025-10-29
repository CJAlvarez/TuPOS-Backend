import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCampaignDto } from './create-campaign.dto';
import { IsInt } from 'class-validator';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiProperty({ description: 'ID de la campaña' })
  @IsInt()
  id: number;
}