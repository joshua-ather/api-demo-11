import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TransactionModel {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
