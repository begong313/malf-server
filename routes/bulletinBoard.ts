import { Router } from "express";
import cors from "cors";
import upload from "./bulletinBoardMulter";

import {
    createPost,
    getPostDetail,
    getPostList,
    deletePost,
    picTest,
} from "../model/bulletinBoard";

const router: Router = Router();

router.use(cors());

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", createPost); //글작성
router.get("/post/:id", getPostDetail); //글 세부창 불러오기
router.delete("/post/:id", deletePost);
router.post("/pictest", upload.array("image", 10), picTest); // 사진 최대 개수 10개

export default router;
