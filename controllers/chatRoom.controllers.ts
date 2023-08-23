import { NextFunction, Request, Response } from "express";

import { RowDataPacket } from "mysql2";
import { HttpException } from "../exeptions/HttpException";
import { Container } from "typedi";
import { ChatRoomModel } from "../models/chatRoom.model";

import SocketIO from "socket.io";

export class ChatRoomController {
    public chatRoom = Container.get(ChatRoomModel);
    /* 
채팅방 참가 신청 
todo : ?? 이미 채팅방에 입장한 상태라면 에러 띄우기
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
            console.log(data.affectedRows);
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
todo : 불러오는 사람이 권한이 있는지 검사, 어떤 데이터들을 보내줄것인지 정하기
*/
    public loadEnterRequestChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        // const user_uniq_id = response.locals.decoded;

        try {
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
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
    public agreeEnterChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        // const user_uniq_id = response.locals.decoded;
        const applicant_uniq_id: string = "test_1"; //todo : 신청한 사람의 아이디

        try {
            await this.chatRoom.agreeEnterChatRoom(post_id, applicant_uniq_id);

            response.status(200).json({
                status: 200,
                message: "채팅방 입장 등록 성공",
            });
        } catch (err) {
            // Todo : 만약 쿼리문이 하나만 성공하고 하나는 실패한다면?
            next(new HttpException(400, "채팅방 입장 등록 실패"));
        }
    };

    /* 채팅방 입장 거절 
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
    public disagreeEnterChatroom = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        // const user_uniq_id = response.locals.decoded;
        const applicant_uniq_id: string = "test_1"; //todo : 신청한 사람의 아이디를 어떻게 가져올 것인가

        try {
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
todo : 어떤 정보를 가져올지 정해야됨
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

    public soketJS = async (request: Request, response: Response) => {
        // const socket  = socket.on('connection', (socket: SocketIO.Socket) => {}
    };

    /* 만들어야 할 기능 
1. 주석의 Todo들
2. lock 을 사용해야 할거같음. 신청요청과 승락이 동시에 이루어지면 곤란한 상황 발생
*/
}
