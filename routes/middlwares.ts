import jwt from "jsonwebtoken";
import { passportConfig } from "../config/passport_config";

function verifyToken(request: any, response: any, next: any) {
    try {
        console.log(request.authorization);
        response.locals.decoded = jwt.verify(
            request.headers.authorization,
            passportConfig.jwt.secretKey
        );
        return next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            // 유효기간 초과
            return response.status(419).json({
                code: 419,
                message: "토큰이 만료되었습니다",
            });
        }
        return response.status(401).json({
            code: 401,
            message: "유효하지 않은 토큰입니다",
        });
    }
}

export { verifyToken };
