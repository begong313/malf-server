import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";
import { ReportController } from "../controllers/report.controller.js";

export class ReportRouter implements Routes {
    public path = "/report";
    public router = express.Router();
    public report = new ReportController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // 글 신고
        this.router.post("/post", this.report.reportPost);
        // 유저 신고
        this.router.post("/user", this.report.reportUser);
        // 채팅 신고
        this.router.post("/chat", this.report.reportChat);

        //커뮤니티 글 신고
        this.router.post("/community", this.report.reportCommunity);
        //커뮤니티 댓글 신고
        this.router.post("/community/reply", this.report.reportCommunityReply);
        //커뮤니티 대댓글 신고
        this.router.post(
            "/community/rereply",
            this.report.reportCommunityReReply
        );
    }
}
