import { Router } from "express";
import {
    wantJoinChatroom,
    cancelJoinChatroom,
    getEnterRequestChatroom,
    agreeEnterChatroom,
    disagreeEnterChatroom,
    leaveChatroom,
    getChatMembers,
} from "../controllers/chatRoom";

import { verifyToken } from "../lib/middlwares";

const router: Router = Router();

router.use(verifyToken);

router.post("/:id/subscribe", wantJoinChatroom); //채팅방 입장 신청
router.delete("/:id/subscribe", cancelJoinChatroom); //입장 신청 취소(철회)

router.get("/:id/agreement", getEnterRequestChatroom); // 채팅방 입장 신청리스트 가져오기
router.post("/:id/agreement", agreeEnterChatroom); //채팅방 입장 허가(승인)
router.delete("/:id/agreement", disagreeEnterChatroom); //채팅방 입장신청 거절

router.delete("/:id/leaving", leaveChatroom); //채팅방 나가기
router.get("/:id/members", getChatMembers); //참여 맴버 가져오기

export default router;
