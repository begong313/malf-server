import passport from "passport";
const KakaoStrategy = require("passport-kakao").Strategy;

export default function kakao() {
    passport.use(
        new KakaoStrategy(
            {
                clientID: String(process.env.KAKAO_ID),
                callbackURL: "/auth/kakao/callback",
            },
            async (
                accessToken: any,
                refreshToken: any,
                profile: any,
                done: any
            ) => {
                console.log(accessToken);
                console.log(refreshToken);
                console.log(profile);
                done(null, profile);
            }
        )
    );
}
