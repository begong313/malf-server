import express, { Router, Response, Request } from "express";
import passport from "passport";
import {
    kakaoCallback,
    googleCallback,
    localJoin,
    localLoginCallback,
    loginError,
    lineRedirect,
    lineCallback,
} from "../controllers/auth";

const router: Router = express.Router();
router.use(express.json());

//for kakao
router.get("/kakao", passport.authenticate("kakao"));
router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        session: false,
        failureRedirect: "/auth/login-error",
    }),
    kakaoCallback
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth/login-error",
    }),
    googleCallback
);

router.get("/line", lineRedirect);
router.get("/line/callback", lineCallback);

router.post("/local/join", localJoin); //회원가입
router.post(
    "/local/login",
    passport.authenticate("local", {
        session: false,
        failureRedirect: "/auth/login-error", //Todo :나중에 지정 해야할듯 => 로그인 실패 메시지 전달하게
    }),
    localLoginCallback
);

router.get("/login-error", loginError);

export default router;
