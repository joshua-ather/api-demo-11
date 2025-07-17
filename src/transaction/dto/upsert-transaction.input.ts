import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpsertTransactionInput {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  id?: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
