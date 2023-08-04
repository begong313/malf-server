import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router: Router = Router();

router.get("/:picURL", (request: Request, response: Response) => {
    const imagePath = path.join(
        __dirname,
        `../../public/images/${request.params.picURL}`
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
});

export default router;
