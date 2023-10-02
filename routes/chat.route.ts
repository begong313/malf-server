import express from "express";
import { Routes } from "../interfaces/routes.interface";
import upload from "../lib/multerCustom";
import { ChatController } from "../controllers/chat.controllers";
import { verifyToken } from "../middlewares/auth.middleware.ts";

export class ChatRouter implements Routes {
    public path = "/chat";
    public router = express.Router();
    public chat = new ChatController();

    constructor() {
        this.initializeRoutes();
        this.router.use(verifyToken);
    }

    private initializeRoutes() {
        //쌓인 채팅 가져오기
        this.router.get("/chats/:id", this.chat.getChat);

        //사진 보내기
        this.router.post(
            "/:id/image",
            upload.array("image", 10),
            this.chat.sendImage
        );
    }
}

export default ChatRouter;
