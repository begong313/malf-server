import passport from "passport";
import kakao from "./kakaoStratgy";

function passportConfig() {
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser<any, any>((user, done) => {
        // 세션으로부터 사용자 정보를 복원합니다.
        console.log(user);
        done(null, user);
    });
    kakao();
}

export default passportConfig;
