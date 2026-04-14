import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = exception.meta?.target as string[];
        message = `Duplicate entry: ${target?.join(', ') || 'field'} already exists`;
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found or already deleted';
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference: related record does not exist';
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Operation violates data relationship constraints';
        break;

      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'Input value is too long for the field';
        break;

      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = 'The requested record does not exist';
        break;

      default:
        this.logger.error(
          `Unhandled Prisma error: ${exception.code} - ${exception.message}`,
        );
        message = 'Database operation failed';
    }

    this.logger.warn(
      `Prisma error [${exception.code}]: ${message} | Meta: ${JSON.stringify(exception.meta)}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      timestamp: new Date().toISOString(),
    });
  }
}
