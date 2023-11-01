import express from "express";
import { ChatRoomController } from "../controllers/chatRoom.controllers";

import { verifyToken } from "../middlewares/auth.middleware.ts";
import { Routes } from "../interfaces/routes.interface";

export class ChatRoomRouter implements Routes {
    public path = "/chatroom";
    public router = express.Router();
    public chatRoom = new ChatRoomController();

    constructor() {
        this.router.use(verifyToken);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //채팅방 입장 신청
        this.router.post(`/:id/subscribe`, this.chatRoom.wantJoinChatroom);

        //입장 신청 취소(철회)
        this.router.delete(`/:id/subscribe`, this.chatRoom.cancelJoinChatroom);

        // 채팅방 입장 신청리스트 가져오기
        this.router.get(
            `/:id/agreement`,
            this.chatRoom.loadEnterRequestChatroom
        );

        //채팅방 입장 허가(승인)
        this.router.post(`/:id/agreement`, this.chatRoom.agreeEnterChatroom);

        //채팅방 입장신청 거절
        this.router.delete(
            `/:id/agreement`,
            this.chatRoom.disagreeEnterChatroom
        );

        //채팅방 나가기
        this.router.delete(`/:id/chatroom`, this.chatRoom.leaveChatroom);

        //참여 맴버 가져오기
        this.router.get(`/:id/members`, this.chatRoom.loadChatMembers);

        //본인이 참여한 채팅방 가져오기
        this.router.get("/chatrooms", this.chatRoom.loadMyChatRooms);
    }
}
