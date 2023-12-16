import express, { Router, Request, Response, response } from "express";
import { Routes } from "../interfaces/routes.interface";
import { BannerController } from "../controllers/banner.controller";

export class BannerRoute implements Routes {
    public path = "/banner";
    public router = express.Router();
    public bannerController = new BannerController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        //상단배너 가져오기
        this.router.get(`/top`, this.bannerController.getTopBanner);
        //상단 배너 등록
        this.router.post(`/top`, this.bannerController.postTopBanner);
    }
}
