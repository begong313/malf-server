import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router: Router = Router();

router.get("/:picURL", (request: Request, response: Response) => {
    const imagePath = path.join(
        __dirname,
        `../../public/images/${request.params.picURL}`
    );
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(response);
});

export default router;
