import { Request, Response } from "express";
import pool from "../lib/dbConnector";
import { MysqlError, OkPacket } from "mysql";

/* 
채팅방 참가 신청 
todo : ?? 이미 채팅방에 입장한 상태라면 에러 띄우기
*/
function wantJoinChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id: string = "123"; //todo (header의 User였나 auth에서 가져오기)

    pool.query(
        `insert into post_want_join (post_id, user_uniq_id) values ("${post_id}","${user_uniq_id}")`,
        (err: MysqlError, results: OkPacket) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "채팅방 참가 신청 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                post_id: "채팅방 참가신청 성공",
            });
        }
    );
}

/*
입장 신청 취소(철회)
Todo : 만약 입장요청 취소와 승인이 동시에 이루어진다면? (Lock을 사용해야 할듯)
*/
function cancelJoinChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id: string = "123"; //todo : header에서 가져오기
    pool.query(
        `delete from post_want_join where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}" `,
        (err: MysqlError, results: OkPacket) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "채팅방 입장 요청 취소 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                post_id: "채팅방 입장 요청 취소 성공 ",
            });
        }
    );
}

/*
채팅방 참가요청 리스트 불러오기
todo : 불러오는 사람이 권한이 있는지 검사, 어떤 데이터들을 보내줄것인지 정하기
*/
function getEnterRequestChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id: string = "123"; //todo(header의 User였나 auth에서 가져오기)

    pool.query(
        `select * from post_want_join join user_require_info on post_want_join.user_uniq_id = user_require_info.user_uniq_id where post_id = "${post_id}"`,
        (err: MysqlError, results: any[]) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "신청목록 불러오기 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                data: results,
            });
        }
    );
}

/* 
채팅방 참가 승인 
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
function agreeEnterChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const manager_uniq_id: string = ""; //방장 아이디 (header의 User였나 auth에서 가져오기)
    const applicant_uniq_id: string = "123"; //todo : 신청한 사람의 아이디

    pool.query(
        `insert into post_participation (post_id, user_uniq_id) values ("${post_id}","${applicant_uniq_id}")`,
        (err: MysqlError, results: OkPacket) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "채팅방 입장 등록 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                post_id: "채팅방 입장 등록 성공",
            });
        }
    );
    pool.query(
        `delete from post_want_join where post_id = "${post_id}" and user_uniq_id = "${applicant_uniq_id}" `,
        (err: MysqlError) => {
            if (err) {
            }
            console.log("요청리스트에서 삭제성공");
        }
    );
}

/* 채팅방 입장 거절 
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
function disagreeEnterChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const manager_uniq_id: string = ""; //방장 아이디(header의 User였나 auth에서 가져오기)
    const applicant_uniq_id: string = "123"; //todo : 신청한 사람의 아이디

    pool.query(
        `delete from post_want_join where post_id = "${post_id}" and user_uniq_id = "${applicant_uniq_id}" `,
        (err: MysqlError, results: OkPacket) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "채팅방 입장 거절 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                post_id: "채팅방 입장 거절 성공",
            });
        }
    );
}

/* 채팅방 나가기*/
function leaveChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id: string = "123"; //todo : (header에서 가져오기)
    pool.query(
        `delete from post_participation where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}" `,
        (err: MysqlError, results: OkPacket) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "채팅방 떠나기 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                post_id: "채팅방 떠나기 성공",
            });
        }
    );
}

/*
채팅방 맴버 가져오기 
todo : 어떤 정보를 가져올지 정해야됨
*/
function getChatMembers(request: Request, response: Response) {
    const post_id: string = request.params.id;
    pool.query(
        `select * from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id = "${post_id}"`,
        (err: MysqlError, results: any[]) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    Code: 400,
                    message: "신청목록 불러오기 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                data: results,
            });
        }
    );
}

/* 만들어야 할 기능 
1. 주석의 Todo들
2. lock 을 사용해야 할거같음. 신청요청과 승락이 동시에 이루어지면 곤란한 상황 발생
*/

export {
    wantJoinChatroom,
    cancelJoinChatroom,
    getEnterRequestChatroom,
    agreeEnterChatroom,
    disagreeEnterChatroom,
    leaveChatroom,
    getChatMembers,
};
