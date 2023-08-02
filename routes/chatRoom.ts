import { Router } from "express";
import upload from "../lib/multerCustom";
import {
    wantJoinChatroom,
    cancelJoinChatroom,
    getEnterRequestChatroom,
    agreeEnterChatroom,
    disagreeEnterChatroom,
    leaveChatroom,
    getChatMembers,
} from "../controllers/chatRoom";

import { verifyToken } from "./middlwares";

const router: Router = Router();

// router.use(verifyToken); //현재 test를 위해 비활성화 해놓은 상태 app.ts로 빼도 되지 않을까? 어짜피 매번 로그인되어있나 검사할건데

router.post("/:id/subscribe", wantJoinChatroom); //채팅방 입장 신청
router.delete("/:id/subscribe", cancelJoinChatroom); //입장 신청 취소

router.get("/:id/agreement", getEnterRequestChatroom); // 채팅방 입장 신청리스트 가져오기
router.post("/:id/agreement", agreeEnterChatroom); //채팅방 입장 허가(승인)
router.delete("/:id/agreement", disagreeEnterChatroom); //채팅방 입장신청 거절

router.post("/:id/leaving", leaveChatroom); //채팅방 나가기
router.get("/:id/members", getChatMembers); //참여 맴버 가져오기

export default router;
