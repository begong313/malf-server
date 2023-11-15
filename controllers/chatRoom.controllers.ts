import { NextFunction, Request, Response } from "express";

import { RowDataPacket } from "mysql2";
import { HttpException } from "../exeptions/HttpException";
import { Container } from "typedi";
import { ChatRoomModel } from "../models/chatRoom.model";
import Chat from "../schemas/chat";
import mongoose from "mongoose";
import RightChecker from "../lib/rightChecker";

export class ChatRoomController {
    public chatRoom = Container.get(ChatRoomModel);
    /* 
    채팅방 참가 신청 
    todo : ?? 이미 채팅방에 입장한 상태라면 에러 띄우기
    todo : 정원이 다 차면 신청을 못하게 해야함
    */
    public wantJoinChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;
        try {
            this.chatRoom.wantJoinChatRoom(post_id, user_uniq_id);
            response.status(200).json({
                status: 200,
                message: "채팅방 참가신청 성공",
            });
        } catch (err) {
            // 개시글이 없을때 에러 처리해야함.
            next(new HttpException(400, "채팅방 참가 신청 실패"));
        }
    };

    /*
    입장 신청 취소(철회)
    Todo : 만약 입장요청 취소와 승인이 동시에 이루어진다면? (Lock을 사용해야 할듯)
    */
    public cancelJoinChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;

        try {
            const data = await this.chatRoom.cancelJoinChatRoom(
                post_id,
                user_uniq_id
            );
            //todo :글이 없을때 계속 요청을 보낼수가 있음.
            if (data == null) {
                next(new HttpException(400, "채팅방 참가 요청이 없습니다."));
                return;
            }
            response.status(200).json({
                status: 200,
                message: "채팅방 입장 요청 철회 성공 ",
            });
        } catch (err) {
            next(new HttpException(400, "채팅방 입장 요청 취소 실패"));
        }
    };

    /*
    채팅방 참가요청 리스트 불러오기
    */
    public loadEnterRequestChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;

        try {
            if (!(await RightChecker.postRightCheck(user_uniq_id, post_id))) {
                next(new HttpException(401, "권한이 없습니다"));
                return;
            }
            const rows: RowDataPacket[] =
                await this.chatRoom.loadEnterRequestChatRoom(post_id);

            response.status(200).json({
                status: 200,
                data: rows,
            });
        } catch (err) {
            next(new HttpException(400, "신청목록 불러오기 실패"));
        }
    };

    /* 
    채팅방 참가 승인 
    */
    public agreeEnterChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;
        const applicant_uniq_id: any = request.query.id; // 입장을 신청한 사람의 아이디

        try {
            if (!(await RightChecker.postRightCheck(user_uniq_id, post_id))) {
                next(new HttpException(401, "권한이 없습니다"));
                return;
            }
            // 채팅방 참가 메세지 전송
            const io = request.app.get("io").of("/chat");
            const room = request.params.id;
            const chatdata = new Chat({
                room: request.params.id,
                sender: applicant_uniq_id || "default",
                message: "enter",
                sendAt: Date.now(),
                type: 2,
            });
            const collection = mongoose.connection.collection(room);
            await collection.insertOne(chatdata);
            io.to(room).emit("join", chatdata);

            await this.chatRoom.agreeEnterChatRoom(post_id, applicant_uniq_id);
            response.status(200).json({
                status: 200,
                message: "채팅방 입장 승인 성공",
            });
        } catch (err) {
            // Todo : 만약 쿼리문이 하나만 성공하고 하나는 실패한다면?
            next(new HttpException(400, "채팅방 입장 승인 실패"));
        }
    };

    /* 
    채팅방 입장 거절 
    */
    public disagreeEnterChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;
        const applicant_uniq_id: any = request.query.id; //입장을 신청한 사람의 아이디

        if (request.query.user_uniq_id == undefined) {
            next(new HttpException(400, "아이디를 찾을 수 없습니다."));
        }

        try {
            if (!(await RightChecker.postRightCheck(user_uniq_id, post_id))) {
                next(new HttpException(401, "권한이 없습니다"));
                return;
            }
            await this.chatRoom.disagreeEnterChatRoom(
                post_id,
                applicant_uniq_id
            );
            response.status(200).json({
                status: 200,
                message: "채팅방 입장 거절 성공",
            });
        } catch (err) {
            next(new HttpException(400, "채팅방 입장 거절 실패"));
        }
    };

    /* 채팅방 나가기*/
    public leaveChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;

        try {
            await this.chatRoom.leaveChatRoom(post_id, user_uniq_id);

            // 채팅방 나가기 메세지 전송
            const io = request.app.get("io").of("/chat");
            const room = request.params.id;
            const chatdata = new Chat({
                room: request.params.id,
                sender: user_uniq_id || "default",
                message: "leave",
                sendAt: Date.now(),
                type: 3,
            });
            const collection = mongoose.connection.collection(room);
            await collection.insertOne(chatdata);
            io.to(room).emit("join", chatdata);

            response.status(200).json({
                status: 200,
                message: "채팅방 떠나기 성공",
            });
        } catch (err) {
            next(new HttpException(400, "채팅방 떠나기 실패"));
        }
    };

    /*
    채팅방 맴버 가져오기 
    todo : 채팅에 참여한 사람만 가져올수있게?
    */
    public loadChatMembers = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        try {
            const rows = await this.chatRoom.loadChatMembers(post_id);
            response.status(200).json({
                status: 200,
                data: rows,
            });
        } catch (err) {
            next(new HttpException(400, "신청목록 불러오기 실패"));
        }
    };

    //참가한 채팅방 가져오기

    public loadMyChatRooms = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        try {
            const rows = await this.chatRoom.loadMyChatRooms(user_uniq_id);
            response.status(200).json({
                status: 200,
                data: rows,
            });
        } catch (err) {
            next(new HttpException(400, "내 채팅방 불러오기 실패"));
        }
    };

    /* 만들어야 할 기능 
1. 주석의 Todo들
2. lock 을 사용해야 할거같음. 신청요청과 승락이 동시에 이루어지면 곤란한 상황 발생
*/
}
