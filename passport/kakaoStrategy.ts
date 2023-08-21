import passport from "passport";
import { Strategy } from "passport-kakao";
import { oauthConfig } from "../config/oauth_config";
import jwtGenerate from "../lib/jwtGenerator";

import { getUserUniqId } from "./lib";

function kakao() {
    passport.use(
        new Strategy(
            oauthConfig.kakao,
            async (
                accessToken: any,
                refreshToken: any,
                profile: any,
                done: any
            ) => {
                const user_uniq_id: string = await getUserUniqId(
                    "kakao",
                    profile.id
                );
                //Jwt생성
                const jwtToken = jwtGenerate(user_uniq_id);
                return done(null, jwtToken);
            }
        )
    );
}

export default kakao;
