import { IsOptional, IsUUID } from 'class-validator';

export class GetTransactionQueryDto {
  @IsOptional()
  @IsUUID()
  id?: string;
}
