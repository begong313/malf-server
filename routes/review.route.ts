import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";
import { ReviewController } from "../controllers/review.controllers.js";

export class ReviewRouter implements Routes {
    public path = "/review";
    public router = express.Router();
    public review = new ReviewController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // 첫 실행시 유저정보 등록
        this.router.post("/user", this.review.reviewUser);
    }
}
