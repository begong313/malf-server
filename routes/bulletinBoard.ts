import { Router } from "express";
import cors from "cors";
import multer from "multer";

import {
    createPost,
    getPostDetail,
    getPostList,
    deletePost,
    picTest,
} from "../model/bulletinBoard";

const router: Router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
        const uniqueSuffix =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            "." +
            file.mimetype.split("/")[1];

        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage: storage });

router.use(cors());

router.get("/posts", getPostList); //홈화면 글 리스트 불러오기
router.post("/posts", createPost); //글작성
router.get("/post/:id", getPostDetail); //글 세부창 불러오기
router.delete("/post/:id", deletePost);
router.post("/pictest", upload.array("image", 10), picTest);
export default router;
