import express from "express";
import upload from "../lib/multerCustom";
import { UserInfoController } from "../controllers/userInfo.controllers";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";

export class UserInfoRouter implements Routes {
    public path = "/userinfo";
    public router = express.Router();
    public userInfo = new UserInfoController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/first-set-info`,
            upload.array("image", 1),
            this.userInfo.firstSetInfo
        ); // 첫 실행시 유저정보 등록창
    }
}
