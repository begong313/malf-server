import { Router } from "express";
import { createPost, getPostDetail, getPostList } from "../model/bulletinBoard";
import cors from "cors";

const router: Router = Router();
router.use(cors());

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", createPost); //
router.get("/post/:id", getPostDetail);

export default router;
