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

  // 'info' en producción (no 'warn'): con 'warn' se descartan los mensajes de arranque
  // de Nest y los accesos HTTP del LoggingInterceptor, dejando el contenedor sin ningún
  // log útil para diagnosticar un despliegue.
  return WinstonModule.createLogger({
    level: isProduction ? 'info' : 'debug',
    transports,
  });
}
