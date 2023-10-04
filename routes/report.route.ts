import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";
import { ReportController } from "../controllers/report.controllers";

export class ReportRouter implements Routes {
    public path = "/report";
    public router = express.Router();
    public report = new ReportController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // 첫 실행시 유저정보 등록창
        this.router.post("/post", this.report.reportPost);
        this.router.post("/user", this.report.reportUser);
        this.router.post("/chat", this.report.reportChat);
    }
}
