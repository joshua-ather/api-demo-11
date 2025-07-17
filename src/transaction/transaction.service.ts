import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { UpsertTransactionInput } from './dto/upsert-transaction.input';
import { TransactionModel } from './models/transaction.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async getTransaction(id?: string): Promise<Transaction[] | Transaction> {
    const result = await this.dataSource.query(
      `SELECT * FROM fn_get_transactions($1)`,
      [id || null],
    );

    return id ? result[0] : result;
  }

  async process(input: UpsertTransactionInput): Promise<Partial<Transaction>> {
    const { id, user_id, amount } = input;

    const result = await this.dataSource.query(
      `SELECT * FROM fn_upsert_transaction($1, $2, $3)`,
      [id || null, user_id, amount]
    );

    if (!result || result.length === 0) {
      throw new Error('Upsert transaction failed');
    }

    return {
      id: result[0].out_id,
      created_at: result[0].out_created_at,
      updated_at: result[0].out_updated_at,
    };
  }
}
