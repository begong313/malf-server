import express from "express";
import { uploadID, uploadProfile } from "../lib/multerCustom";
import { UserController } from "../controllers/user.controller";
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
            uploadProfile.array("image", 1),
            this.user.firstSetProfile
        );

        // 유저정보 수정
        this.router.patch(
            "/profile",
            uploadProfile.array("image", 1),
            this.user.updateUserProfile
        );

        //계정 탈퇴
        this.router.delete("/profile", this.user.resignUser);

        //계정 상태 가져오기
        this.router.get("/status", this.user.getUserStatus);
        //프로필 창 데이터 가져오기
        this.router.get("/profile/:id", this.user.getUserProfile);

        //학생증 등록
        this.router.post(
            "/student-id",
            uploadID.array("image", 1),
            this.user.setStudentID
        );

        //유저가 좋아요 누른 글 모아보기
        this.router.get("/:id/likelist", this.user.getLikeList);

        //유저가 쓴 글 모아보기
        this.router.get("/:id/writelist", this.user.getWriteList);

        //유저가 참가 신청한 글 모아보기
        this.router.get("/:id/applylist", this.user.getApplyList);

        //닉네임 중복 체크
        this.router.get("/nickname/:nickname", this.user.checkNickname);

        // 커뮤니티에 쓴 글 모아보기
        this.router.get("/:id/community-writelist", this.user.getCommunityList);
        // 커뮤니티에 쓴 댓글 모아보기
        this.router.get(
            "/:id/community-replylist",
            this.user.getCommunityReplyList
        );
        // 커뮤니티 스크랩 글 모아보기
        this.router.get(
            "/:id/community-scraplist",
            this.user.getCommunityScrapList
        );
    }
}
