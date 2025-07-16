export class SuccessResponseDto<T = undefined> {
  success: true;
  message: string;
  statusCode: number;
  data?: T;
}