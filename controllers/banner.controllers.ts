import { Container } from "typedi";
import { BannerModel } from "../models/banner.model";
import { NextFunction, Request, Response } from "express";

export class BannerController {
    public bulletinBoard = Container.get(BannerModel);

    public getTopBanner = async (request: Request, response: Response) => {
        const rows = await this.bulletinBoard.getTopBanner();
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };
    public postTopBanner = async (request: Request, response: Response) => {
        const { picture } = request.body;
        // const rows = await this.bulletinBoard.postTopBanner(picture);
        response.status(200).json({
            status: 200,
        });
    };
}
