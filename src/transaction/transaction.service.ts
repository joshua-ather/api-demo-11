import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) { }

  async getTransaction(id?: string): Promise<Transaction[] | Transaction> {
    const result = await this.dataSource.query(
      `SELECT * FROM fn_get_transactions($1)`,
      [id || null],
    );

    return id ? result[0] : result;
  }
}
