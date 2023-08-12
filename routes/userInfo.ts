import express, { Router, Response, Request } from "express";
import upload from "../lib/multerCustom";
import { firstSetInfo } from "../controllers/userInfo";
import { verifyToken } from "../lib/middlwares";

const router: Router = express.Router();
router.use(verifyToken);

router.post("/first-set-info", upload.array("image", 1), firstSetInfo); // 첫 실행시 유저정보 등록창

export default router;
