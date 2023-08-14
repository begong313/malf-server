import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exeptions/HttpException";
// import { logger } from '@utils/logger';

export const ErrorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(error);
        const status: number = error.status || 500;
        const message: string = error.message || "Something went wrong";

        // logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ status: status, message: message });
    } catch (error) {
        next(error);
    }
};
