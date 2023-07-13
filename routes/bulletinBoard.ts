import { Router } from "express";
import {
    createPost,
    getPostDetail,
    getPostList,
    deletePost,
} from "../model/bulletinBoard";
import cors from "cors";

const router: Router = Router();
router.use(cors());

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", createPost); //글작성
router.get("/post/:id", getPostDetail); //글 세부창 불러오기
router.delete("/post/:id", deletePost);

export default router;
