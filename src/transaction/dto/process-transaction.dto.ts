import { IsOptional, IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionProcessDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsUUID()
  user_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
