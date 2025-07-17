import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    let message: string | string[] = 'Something went wrong';
    let rawErrors: any = {};

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const res = exceptionResponse as any;

      if (Array.isArray(res.message) && res.message.every(msg => typeof msg === 'string')) {
        message = 'Invalid validation';
        rawErrors = this.formatValidationErrors(res.message);
      } else if (res.message) {
        message = res.message;
        rawErrors = { message: Array.isArray(message) ? message : [message] };
      }
    }

    const formatted: ErrorResponseDto = {
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      statusCode,
      errors: rawErrors,
    };

    try {
      GqlArgumentsHost.create(host).getContext();
      throw new HttpException(formatted, statusCode);
    } catch {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      if (typeof response.status === 'function') {
        response.status(statusCode).json(formatted);
      }
    }
  }

  private formatValidationErrors(messages: string[]) {
    const fieldErrorMap: Record<string, string[]> = {};

    messages.forEach((msg) => {
      const [field, ...rest] = msg.split(' ');
      const fullMsg = rest.join(' ');
      if (!fieldErrorMap[field]) {
        fieldErrorMap[field] = [];
      }
      fieldErrorMap[field].push(fullMsg);
    });

    return fieldErrorMap;
  }
}
