import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResp = exception.getResponse();

    let message = 'An error occurred';
    let errors: Record<string, string[] | string> = {};

    if (typeof errorResp === 'object' && (errorResp as any).message) {
      const raw = (errorResp as any).message;

      console.log(raw);

      if (Array.isArray(raw)) {
        message = 'Validation failed';

        // Convert error messages from class-validator into field-based format
        for (const msg of raw) {
          const [field, ...rest] = msg.split(' ');
          const formatted = rest.join(' ') || msg;

          if (!errors[field]) errors[field] = [];
          (errors[field] as string[]).push(formatted);
        }
      } else {
        message = raw;
        errors = { message: raw };
      }
    } else if (typeof errorResp === 'string') {
      message = errorResp;
      errors = { message: errorResp };
    }

    const responseBody: ErrorResponseDto = {
      success: false,
      message,
      statusCode: status,
      errors,
    };

    response.status(status).json(responseBody);
  }
}
