export class ErrorResponseDto {
  success: false;
  message: string;
  statusCode: number;
  errors: Record<string, string[] | string>;
}
