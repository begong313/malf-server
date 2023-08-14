import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controllers";
import { passportConfig } from "../config/passport_config";
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
        this.router.get(`${this.path}/kakao`, passport.authenticate("kakao"));
        this.router.get(
            `${this.path}/kakao/callback`,
            passport.authenticate("kakao", passportConfig.setting),
            this.auth.loginCallback
        );

        //for google
        this.router.get(
            `${this.path}/google`,
            passport.authenticate("google", { scope: ["profile"] })
        );
        this.router.get(
            `${this.path}/google/callback`,
            passport.authenticate("google", passportConfig.setting),
            this.auth.loginCallback
        );

        //for line
        this.router.get(`${this.path}/line`, this.auth.lineRedirect);
        this.router.get(`${this.path}/line/callback`, this.auth.lineCallback);

        //for local
        this.router.post(`${this.path}/local/join`, this.auth.localJoin); //회원가입
        this.router.post(
            `${this.path}/local/login`,
            (request: Request, response: Response, next: NextFunction) => {
                passport.authenticate(
                    "local",
                    passportConfig.setting,
                    (err: any, user: any, info: any) => {
                        if (err) return next(err);

                        if (!user) {
                            if (info == undefined) {
                                return response.redirect(
                                    `${this.path}/login-error`
                                );
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

        this.router.get(`${this.path}/login-error`, this.auth.loginError);
    }
}
