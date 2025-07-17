import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Transaction } from './entity/transaction.entity';
import { GetTransactionQueryDto } from './dto/get-transaction-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get()
  async getTransaction(
    @Query() query: GetTransactionQueryDto
  ): Promise<SuccessResponseDto<Transaction | Transaction[]>> {
    const { id } = query;

    const result = await this.transactionService.getTransaction(id);

    if (id) {
      return {
        success: true,
        message: result ? 'OK' : 'Transaction not found',
        statusCode: 200,
        data: result || {}
      };
    }

    return {
      success: true,
      message: Array.isArray(result) && result.length > 0 ? 'Fetched all transactions' : 'Transaction not found',
      statusCode: 200,
      data: result
    };
  }
}
