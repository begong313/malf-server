import express, { Router, Response, Request } from "express";
import passport from "passport";
import {
    kakaoCallback,
    googleCallback,
    localJoin,
    localLoginCallback,
    loginError,
} from "../controllers/auth";
import axios from "axios";

const router: Router = express.Router();
router.use(express.json());

//for kakao
router.get("/kakao", passport.authenticate("kakao"));
router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        session: false,
        failureRedirect: "/auth/login-error", //Todo :나중에 지정 해야할듯
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

router.get("/line", (request, response) => {
    let url =
        "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2000361421&redirect_uri=http://localhost:8000/auth/line/callback&state=12345abcde&scope=profile%20openid";
    response.redirect(url);
});
router.get(
    "/line/callback",

    async (request, response) => {
        const state = request.query.state;
        const code = request.query.code;
        console.log(code);
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        const dataTosend = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:8000/auth/line/callback",
            client_id: "2000361421",
            client_secret: process.env.LINE_SECRET,
        };
        const url = "https://api.line.me/oauth2/v2.1/token";
        const apiresponse = await axios.post(url, dataTosend, { headers });
        console.log(apiresponse.data.access_token);

        //@ts-ignore
        var headers = {
            authorization: `Bearer ${apiresponse.data.access_token}`,
        };
        const userdata = await axios.get("https://api.line.me/v2/profile", {
            headers,
        });
        console.log(userdata.data);

        response.send("Ss");
    }
);

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
