import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exeptions/HttpException";
import { DataStoredInToken } from "../interfaces/auth.interface";
import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";
import { oauthConfig } from "../config/oauth_config";

// const getAuthorization = (req) => {
//     const coockie = req.cookies['Authorization'];
//     if (coockie) return coockie;

//     const header = req.header('Authorization');
//     if (header) return header.split('Bearer ')[1];

//     return null;
//   }

async function verifyToken(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const { user_uniq_id } = jwt.verify(
            request.headers.authorization!,
            oauthConfig.jwt.secretKey
        ) as DataStoredInToken;
        // const user_uniq_id = request.headers.authorization;
        const [findUser]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            "select user_uniq_id from user_id where user_uniq_id = ?",
            [user_uniq_id]
        );
        console.log(findUser);
        if (findUser.length != 0) {
            response.locals.decoded = user_uniq_id;
            next();
            return;
        }
        next(new HttpException(401, "존재하지 않는 사용자입니다"));
    } catch (error: any) {
        if (request.headers.authorization == undefined) {
            next(new HttpException(419, "로그인이 필요합니다."));
            return;
        }
        if (error.name === "TokenExpiredError") {
            // 유효기간 초과
            next(new HttpException(419, "토큰이 만료되었습니다"));
            return;
        }
        next(new HttpException(401, "유효하지 않은 토큰입니다"));
    }
}

export { verifyToken };
