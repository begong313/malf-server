import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { passportConfig } from "../config/passport_config";
import jwtGenerate from "../lib/jwtGenerator";
import { getUserUniqId } from "./lib";

function google() {
    passport.use(
        new Strategy(
            passportConfig.google,
            async (accessToken, refreshToken, profile, cb) => {
                const user_uniq_id: string = await getUserUniqId(
                    "google",
                    profile.id
                );

                //jwt 생성
                const jwtToken = jwtGenerate(user_uniq_id);
                return cb(null, jwtToken);
            }
        )
    );
}

export default google;
