import { createLogger, format, LoggerOptions, transports } from 'winston';
import * as env from 'dotenv';

env.config();

const customFormat = format.printf(({ timestamp, level, stack, message }) => {
    return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
    file: {
        filename: 'error.log',
        level: 'error',
    },
    console: {
        level: 'info',
    },
};

const devLogger: LoggerOptions = {
    format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
    transports: [new transports.Console(options.console)],
};

const prodLogger = {
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [
        new transports.File(options.file),
        new transports.File({
            filename: 'combine.log',
            level: 'info',
        }),
    ],
};

const instanceLogger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
