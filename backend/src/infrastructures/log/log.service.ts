import { Injectable, LoggerService, Scope } from '@nestjs/common';
import {
  createLogger,
  LoggerOptions,
  format,
  transports,
  Logger,
} from 'winston';
import { v4 as uuidV4 } from 'uuid';
import { LogDto } from './dto/log.dto';

export const SERVICE_NAME_LOGGER = {
  ACCESS: 'ACCESS',
  ERROR: 'ERROR',
} as const;

export type ServiceNameLogger =
  (typeof SERVICE_NAME_LOGGER)[keyof typeof SERVICE_NAME_LOGGER];

@Injectable({
  scope: process.env.NODE_ENV === 'development' ? Scope.DEFAULT : Scope.REQUEST,
})
export class LogService implements LoggerService {
  private logger: Logger;

  constructor() {
    const loggerOptions: LoggerOptions = {
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        process.env.NODE_ENV === 'development'
          ? format.prettyPrint()
          : format.json(),
      ),
      defaultMeta: { requestId: uuidV4() },
      transports: [
        new transports.Console({
          silent: Boolean(
            process.env.DISABLE_LOGGING ? process.env.DISABLE_LOGGING : false,
          ),
          format: format.combine(
            process.env.NODE_ENV === 'development'
              ? format.colorize({ all: true })
              : format.colorize({ all: false }),
          ),
        }),
      ],
    };
    this.logger = createLogger(loggerOptions);
  }

  log(dto: LogDto) {
    this.logger.info(dto);
  }

  error(dto: LogDto) {
    this.logger.error(dto);
  }

  warn(dto: LogDto) {
    this.logger.warn(dto);
  }

  debug(dto: LogDto) {
    this.logger.debug(dto);
  }

  verbose(dto: LogDto) {
    this.logger.verbose(dto);
  }

  static registerCustomLoggerService() {
    return new LogService();
  }
}
