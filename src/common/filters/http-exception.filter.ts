import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type CommonErrorResponse = {
  message?: string | string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An error has occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as CommonErrorResponse;
      message = errorResponse.message ?? message;
    }

    response.status(status).json({ statusCode: status, message });
  }
}
