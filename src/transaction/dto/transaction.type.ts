import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field(() => ID)
  id: string;

  @Field()
  user_id: string;

  @Field()
  amount: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
