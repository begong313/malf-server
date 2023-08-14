import express, { Router, Request, Response, response } from "express";
import path from "path";
import fs from "fs";
import { Routes } from "../interfaces/routes.interface";

export class AdRoute implements Routes {
    public path = "/ad";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(
            `${this.path}/list`,
            (resquest: Request, response: Response) => {
                response.status(200).json({
                    status: 200,
                    main_ad: [
                        {
                            pic_url: "ad/1.png",
                            href_url: "www.naver.com",
                        },
                        {
                            pic_url: "ad/1.png",
                            href_url: "www.naver.com",
                        },
                        {
                            pic_url: "ad/1.png",
                            href_url: "www.naver.com",
                        },
                    ],
                    middle_ad: [
                        {
                            pic_url: "ad/2.png",
                            href_url: "www.daum.net",
                        },
                    ],
                });
            }
        );
        this.router.get(
            `${this.path}/:picURL`,
            (request: Request, response: Response) => {
                const imagePath = path.join(
                    __dirname,
                    `../../public/ad/${request.params.picURL}`
                );

                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        response.status(404).json({
                            status: 404,
                            message: "사진의 경로를 확인해주세요",
                        });
                        return;
                    }
                    const imageStream = fs.createReadStream(imagePath);
                    imageStream.pipe(response);
                });
            }
        );
    }
}
