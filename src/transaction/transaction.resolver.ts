import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionType } from './dto/transaction.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UpsertTransactionInput } from './dto/upsert-transaction.input';
import { TransactionModel } from './models/transaction.model';

@UseGuards(GqlAuthGuard)
@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => [TransactionType])
  transactions() {
    return this.transactionService.getTransaction();
  }

  @Query(() => TransactionType, { nullable: true })
  transaction(@Args('id') id: string) {
    return this.transactionService.getTransaction(id);
  }

  @Mutation(() => TransactionType)
  async processTransaction(
    @Args('input') input: UpsertTransactionInput,
  ): Promise<TransactionModel> {
    const model = await this.transactionService.process(input);

    return {
      id: model.id!,
      created_at: model.created_at!,
      updated_at: model.updated_at!,
    };
  }
}
