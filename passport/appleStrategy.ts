import passport from "passport";
import { Strategy } from "passport-apple";
import { oauthConfig } from "../config/oauth_config";
import jwtGenerate from "../lib/jwtGenerator";
import { getUserUniqId } from "./lib";

function apple() {
    passport.use(
        new Strategy(
            oauthConfig.apple,
            async (req, accessToken, refreshToken, idToken, profile, cb) => {
                // const user_uniq_id: string = await getUserUniqId(
                //     "apple",
                //     profile.id
                // );
                // //jwt 생성
                // const jwtToken = jwtGenerate(user_uniq_id);
                // return cb(null, jwtToken);
            }
        )
    );
}

export default apple;
