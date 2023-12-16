import express from "express";
import { uploadImage } from "../lib/multerCustom";
import { BulletinBoardController } from "../controllers/bulletinBoard.controller";

import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";

export class BulletinBoardRouter implements Routes {
    public path = "/bulletin-board";
    public router = express.Router();
    public bulletinBoard = new BulletinBoardController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //홈화면 글 리스트 불러오기
        this.router.get(`/posts`, this.bulletinBoard.loadPostList);

        //글작성, 사진 최대 개수 10개
        this.router.post(
            `/posts`,
            uploadImage.array("image", 10),
            this.bulletinBoard.createPost
        );

        //글 세부창 불러오기
        this.router.get(`/posts/:id`, this.bulletinBoard.loadPostDetail);

        // 글 업데이트
        this.router.patch(
            `/posts/:id`,
            uploadImage.array("image", 10),
            this.bulletinBoard.updatePost
        );

        //글 삭제
        this.router.delete(`/posts/:id`, this.bulletinBoard.deletePost);

        //좋아요 클릭
        this.router.post(`/posts/:id/like`, this.bulletinBoard.pushLike);

        //글 status 변경
        this.router.post("/posts/:id/status", this.bulletinBoard.changeStatus);
    }
}
