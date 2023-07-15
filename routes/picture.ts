import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

const router: Router = Router();
router.use(cors());

router.get("/:picURL", (request: Request, response: Response) => {
    const imagePath = path.join(
        __dirname,
        `../../public/images/${request.params.picURL}`
    );
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(response);
});

export default router;
