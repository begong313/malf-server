import winston, { transports } from "winston";
import winstonDaily from "winston-daily-rotate-file";
import appRoot from "app-root-path";
import process from "process";

const logDir = `${appRoot}/logs`;

const { combine, timestamp, label, printf } = winston.format;
const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
/*
 *log level
 * error : 0, warn : 1, info : 2, http : 3, verbose : 4, debug : 5, silly : 6
 */

//더 가다듬을 필요가 있을 듯.
const logger = winston.createLogger({
    format: combine(
        label({ label: "logtestSystem" }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),

    transports: [
        // level 0 1 2 저장됨
        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // level error만 저장됨
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
    exceptionHandlers: [
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export { logger };
