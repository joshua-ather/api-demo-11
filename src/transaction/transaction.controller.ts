import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Transaction } from './entity/transaction.entity';
import { GetTransactionQueryDto } from './dto/get-transaction-query.dto';
import { TransactionProcessDto } from './dto/process-transaction.dto';

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

  @Post('process')
  async process(@Body() dto: TransactionProcessDto): Promise<SuccessResponseDto<Partial<Transaction>>> {
    const result = await this.transactionService.process(dto);

    return {
      success: true,
      message: dto.id ? 'Transaction updated' : 'Transaction created',
      statusCode: 200,
      data: result,
    };
  }
}
