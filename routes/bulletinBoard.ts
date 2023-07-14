import { Router } from "express";
import {
    createPost,
    getPostDetail,
    getPostList,
    deletePost,
    picTest,
} from "../model/bulletinBoard";
import cors from "cors";
import bodyParser from "body-parser";

const router: Router = Router();
router.use(cors());
router.use(bodyParser.raw({ type: "image/*", limit: "10mb" }));

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", createPost); //글작성
router.get("/post/:id", getPostDetail); //글 세부창 불러오기
router.delete("/post/:id", deletePost);
router.post("/pictest", picTest);
export default router;
