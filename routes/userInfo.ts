import express, { Router, Response, Request } from "express";
import upload from "../lib/multerCustom";
import { firstSetInfo } from "../controllers/user";
import { verifyToken } from "./middlwares";
import pool from "../lib/dbConnector";

const router: Router = express.Router();

router.post(
    "/first-set-info",
    verifyToken,
    upload.array("image", 10),
    firstSetInfo
); // 첫 실행시 유저정보 등록창

router.get("/test", verifyToken, (req, res) => {
    console.log(res.locals.decoded);
    const query = "select * from user_id where user_uniq_id = ?";
    const values = res.locals.decoded.user_uniq_id;
    const rows = pool.execute(query, values);
    console.log(rows);
    res.send("token auth success");
});
export default router;
