import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controllers";
import { oauthConfig } from "../config/oauth_config";
import { Routes } from "../interfaces/routes.interface";

export class AuthRoute implements Routes {
    public path = "/auth";
    public router = express.Router();
    public auth = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //for kakao
        this.router.get(`/kakao`, passport.authenticate("kakao"));
        this.router.get(
            `/kakao/callback`,
            passport.authenticate("kakao", oauthConfig.setting),
            this.auth.loginCallback
        );

        //for google
        this.router.get(
            `/google`,
            passport.authenticate("google", { scope: ["profile"] })
        );
        this.router.get(
            `/google/callback`,
            passport.authenticate("google", oauthConfig.setting),
            this.auth.loginCallback
        );

        //for line
        this.router.get(`/line`, this.auth.lineRedirect);
        this.router.get(`/line/callback`, this.auth.lineCallback);

        // for apple
        this.router.get(`/apple`, passport.authenticate("apple"));
        this.router.post(
            `/apple/callback`,
            passport.authenticate("apple", oauthConfig.setting),
            this.auth.loginCallback
        );

        //for local
        this.router.post(`/local/join`, this.auth.localJoin); //회원가입
        this.router.post(
            `/local/login`,
            (request: Request, response: Response, next: NextFunction) => {
                passport.authenticate(
                    "local",
                    oauthConfig.setting,
                    (err: any, user: any, info: any) => {
                        if (err) return next(err);

                        if (!user) {
                            if (info == undefined) {
                                return response.redirect(`/login-error`);
                            }
                            return response
                                .status(401)
                                .redirect(
                                    `${
                                        this.path
                                    }/login-error?error=${encodeURIComponent(
                                        info.message
                                    )}`
                                );
                        }

                        console.log(request.user);
                        request.user = user;
                        return next();
                    }
                )(request, response, next);
            },
            this.auth.loginCallback
        );

        // access token publish
        this.router.post(`/token-inssuance`, this.auth.tokenPublish);

        this.router.get(`/login-error`, this.auth.loginError);
    }
}
