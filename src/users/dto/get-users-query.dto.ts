import { IsOptional, IsString, IsInt, Min, IsIn, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * Columns the administrators list may be ordered by.
 * Keys are the contract shared with the frontend matrix headers; the service
 * maps each one to its Sequelize order tuple.
 */
export const USERS_ORDERABLE_COLUMNS = [
  'profile.firstname',
  'profile.lastname',
  'profile.phone',
  'user.email',
  'id_admin_type',
  'disabled_at',
] as const;

export type UsersOrderableColumn = (typeof USERS_ORDERABLE_COLUMNS)[number];

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  search_word?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsIn(USERS_ORDERABLE_COLUMNS as unknown as string[])
  order_by?: UsersOrderableColumn;

  // Reads the raw query value via `obj` because the global ValidationPipe runs
  // with enableImplicitConversion, which would coerce the string 'false' to true.
  @IsOptional()
  @Transform(({ obj }) => obj.order_asc === true || obj.order_asc === 'true')
  @IsBoolean()
  order_asc?: boolean;
}
