import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";
import { CommunityController } from "../controllers/community.controller.js";
import { uploadImage } from "../lib/multerCustom.js";

export class CommunityRouter implements Routes {
    public path = "/community";
    public router = express.Router();
    public community = new CommunityController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // 글리스트 가져오기
        this.router.get("/posts", this.community.getPosts);
        // 글 쓰기
        this.router.post(
            "/posts",
            uploadImage.array("image", 10),
            this.community.createPost
        );
        // 글 세부정보 가져오기
        this.router.get("/posts/:post_id", this.community.getPost);
        // 글 수정하기
        this.router.patch(
            "/posts/:post_id",
            uploadImage.array("image", 10),
            this.community.updatePost
        );
        // 글 삭제하기
        this.router.delete("/posts/:post_id", this.community.deletePost);

        //댓글 가져오기
        this.router.get("/posts/:post_id/reply", this.community.getReply);
        //댓글달기
        this.router.post("/posts/:post_id/reply", this.community.createReply);

        //글 스크랩(좋아요)
        this.router.post("/posts/:post_id/scrap", this.community.scrapPost);
        //글 스크랩 취소()
        this.router.delete("/posts/:post_id/scrap", this.community.unscrapPost);
    }
}
