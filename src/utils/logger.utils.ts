import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.combine(
    format.json(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message }) => `${level}: ${message}`)
      )
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new transports.File({
      filename: 'combined.log'
    })
  ]
});