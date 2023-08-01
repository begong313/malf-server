import { Router } from "express";
import cors from "cors";
import upload from "../lib/multerCustom";
import {
    createPost,
    getPostDetail,
    getPostList,
    deletePost,
} from "../controllers/bulletinBoard";
import { verifyToken } from "./middlwares";

const router: Router = Router();

router.use(cors());
// router.use(verifyToken);

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", upload.array("image", 10), createPost); //글작성, 사진 최대 개수 10개
router.get("/post/:id", getPostDetail); //글 세부창 불러오기
router.delete("/post/:id", deletePost);

export default router;
