import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export function createWinstonLogger() {
  const isProduction = process.env.NODE_ENV === 'production';
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isProduction
        ? winston.format.combine(winston.format.timestamp(), winston.format.json())
        : winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('gestion-backend', { prettyPrint: true }),
          ),
    }),
  ];

  return WinstonModule.createLogger({
    level: isProduction ? 'warn' : 'debug',
    transports,
  });
}
