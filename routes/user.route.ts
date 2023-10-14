import express from "express";
import upload from "../lib/multerCustom";
import { UserController } from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";

export class UserRouter implements Routes {
    public path = "/user";
    public router = express.Router();
    public user = new UserController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // 첫 실행시 유저정보 등록
        this.router.post(
            `/profile`,
            upload.array("image", 1),
            this.user.firstSetProfile
        );

        // 유저정보 수정
        this.router.patch(
            "/profile",
            upload.array("image", 1),
            this.user.updateUserProfile
        );

        //계정 탈퇴
        this.router.delete("/profile", this.user.resignUser);

        //계정 상태 가져오기
        this.router.get("/status", this.user.getUserStatus);
        //프로필 창 데이터 가져오기
        this.router.get("/profile/:id", this.user.getUserProfile);

        this.router.post(
            "/student-id",
            upload.array("image", 1),
            this.user.setStudentID
        );
    }
}
