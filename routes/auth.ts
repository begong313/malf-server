import express, { Router, Response, Request } from "express";
import passport from "passport";
import {
    localJoin,
    loginCallback,
    loginError,
    lineRedirect,
    lineCallback,
} from "../controllers/auth";
import { passportConfig } from "../config/passport_config";

const router: Router = express.Router();
router.use(express.json());

//for kakao
router.get("/kakao", passport.authenticate("kakao"));
router.get(
    "/kakao/callback",
    passport.authenticate("kakao", passportConfig.setting),
    loginCallback
);

//for google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", passportConfig.setting),
    loginCallback
);

//for line
router.get("/line", lineRedirect);
router.get("/line/callback", lineCallback);

//for local
router.post("/local/join", localJoin); //회원가입
router.post(
    "/local/login",
    (req, res, next) => {
        passport.authenticate(
            "local",
            passportConfig.setting,
            (err: any, user: any, info: any) => {
                if (err) return next(err);

                if (!user) {
                    if (info == undefined) {
                        return res.redirect("/auth/login-error");
                    }
                    return res
                        .status(401)
                        .redirect(
                            `/auth/login-error?error=${encodeURIComponent(
                                info.message
                            )}`
                        );
                }

                console.log(req.user);
                req.user = user;
                return next();
            }
        )(req, res, next);
    },
    loginCallback
);

router.get("/login-error", loginError);

export default router;
