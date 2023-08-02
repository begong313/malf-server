import { Router } from "express";
import upload from "../lib/multerCustom";
import {
    getPostList,
    createPost,
    getPostDetail,
    updatePost,
    deletePost,
    pushLike,
} from "../controllers/bulletinBoard";

import { verifyToken } from "./middlwares";

const router: Router = Router();

// router.use(verifyToken); //현재 test를 위해 비활성화 해놓은 상태

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", upload.array("image", 10), createPost); //글작성, 사진 최대 개수 10개
router.get("/posts/:id", getPostDetail); //글 세부창 불러오기
router.patch("/post/:id", updatePost); // 글 업데이트
router.delete("/posts/:id", deletePost); //글 삭제

router.post("posts/:id/like", pushLike); //좋아요 클릭

//todo : api문서 주소 업데이트. 모두 Posts로 주소를 바꿨음.
export default router;
