import jwt from "jsonwebtoken";
import { oauthConfig } from "../config/oauth_config";

interface tokenPayload {
    user_uniq_id: string;
}

/* jwt token 생성하는 함수 userData : 사용자 Id */
function jwtGenerate(userData: string) {
    const tokenPayload: tokenPayload = {
        user_uniq_id: userData,
    };

    const jwtToken = {
        refreshToken: jwt.sign(tokenPayload, oauthConfig.jwt.secretKey, {
            expiresIn: "7d",
        }),
        accessToken: jwt.sign(tokenPayload, oauthConfig.jwt.secretKey, {
            expiresIn: "7d",
        }),
    };

    return jwtToken;
}

export default jwtGenerate;
