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
        // 첫 실행시 유저정보 등록창
        this.router.post(
            `/userinfo`,
            upload.array("image", 1),
            this.userInfo.firstSetInfo
        );

        // 유저정보 수정창
        this.router.patch(
            "/userinfo",
            upload.array("image", 1),
            this.userInfo.updateUserInfo
        );

        //계정 탈퇴
        this.router.delete("/userinfo", this.userInfo.resignUser);

        //계정 상태 가져오기
        this.router.get("/status", this.userInfo.getUserStatus);
        //프로필 창 데이터 가져오기
        this.router.get("/userinfo/:id", this.userInfo.getUserInfo);
    }
}
