import express from "express";
import upload from "../lib/multerCustom";
import { BulletinBoardController } from "../controllers/bulletinBoard.controllers";

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
        this.router.get(`${this.path}/posts`, this.bulletinBoard.loadPostList);

        //글작성, 사진 최대 개수 10개
        this.router.post(
            `${this.path}/posts`,
            upload.array("image", 10),
            this.bulletinBoard.createPost
        );

        //글 세부창 불러오기
        this.router.get(
            `${this.path}/posts/:id`,
            this.bulletinBoard.loadPostDetail
        );

        // 글 업데이트(미구현)
        this.router.patch(
            `${this.path}/post/:id`,
            this.bulletinBoard.updatePost
        );

        //글 삭제
        this.router.delete(
            `${this.path}/posts/:id`,
            this.bulletinBoard.deletePost
        );

        //좋아요 클릭
        this.router.post(
            `${this.path}/posts/:id/like`,
            this.bulletinBoard.pushLike
        );
    }
}

//todo : api문서 주소 업데이트. 모두 Posts로 주소를 바꿨음.
