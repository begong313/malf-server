import passport from "passport";
import { Strategy } from "passport-apple";
import { oauthConfig } from "../config/oauth_config";
import jwt from "jsonwebtoken";
import jwtGenerate from "../lib/jwtGenerator";
import { getUserUniqId } from "./lib";

function apple() {
    passport.use(
        new Strategy(
            {
                clientID: process.env.APPLE_ID!,
                teamID: process.env.APPLE_TEAM_ID!,
                callbackURL: "https://malftravel.com/auth/apple/callback",
                keyID: process.env.APPLE_KEY_ID!,
                privateKeyString: process.env.APPLE_PRIVATE_KEY!,
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, idToken, profile, cb) => {
                const idTokenDecoded: any = jwt.decode(idToken);
                //token변환시키고 값넣어주면될듯
                // todo : 이부분 type지정해서
                const user_uniq_id: string = await getUserUniqId(
                    "apple",
                    idTokenDecoded.sub
                );

                //jwt 생성
                const jwtToken = jwtGenerate(user_uniq_id);
                cb(null, jwtToken);
            }
        )
    );
}

export default apple;
