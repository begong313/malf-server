import jwt from "jsonwebtoken";
import { passportConfig } from "../config/passport_config";

interface tokenPayload {
    user_uniq_id: string;
}

/* jwt token 생성하는 함수 userData : 사용자 Id */
function jwtGenerate(userData: string) {
    const tokenPayload: tokenPayload = {
        user_uniq_id: userData,
    };

    const jwtToken = {
        refreshToken: jwt.sign(tokenPayload, passportConfig.jwt.secretKey, {
            expiresIn: "15m",
        }),
        accessToken: jwt.sign(tokenPayload, passportConfig.jwt.secretKey, {
            expiresIn: "7d",
        }),
    };

    return jwtToken;
}

export default jwtGenerate;
