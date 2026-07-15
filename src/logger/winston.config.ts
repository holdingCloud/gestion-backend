import { utilities, WinstonModule } from 'nest-winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
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

  if (process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET) {
    transports.push(
      new AxiomTransport({
        dataset: process.env.AXIOM_DATASET,
        token: process.env.AXIOM_TOKEN,
      }),
    );
  }

  return WinstonModule.createLogger({
    level: isProduction ? 'warn' : 'debug',
    transports,
  });
}
