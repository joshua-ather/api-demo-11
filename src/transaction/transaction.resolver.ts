import { Resolver, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { TransactionType } from './dto/transaction.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

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
}
