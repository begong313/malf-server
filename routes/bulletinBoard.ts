import { Router } from "express";
import { createPost, getPostDetail, getPostList } from "../model/bulletinBoard";
import cors from "cors";

const router: Router = Router();
router.use(cors());

router.get("/posts", getPostList);
router.post("/posts", createPost);
router.get("/post/:id", getPostDetail);

export default router;
