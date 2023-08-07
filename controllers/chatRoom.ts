import { Request, Response } from "express";
import pool from "../lib/dbConnector";
import { MysqlError, OkPacket } from "mysql";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";

/* 
채팅방 참가 신청 
todo : ?? 이미 채팅방에 입장한 상태라면 에러 띄우기
*/
async function wantJoinChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const query: string = `insert into post_want_join (post_id, user_uniq_id) values (?,?)`;
    const values: any[] = [post_id, user_uniq_id];
    try {
        await pool.execute(query, values);
        response.status(200).json({
            status: 200,
            post_id: "채팅방 참가신청 성공",
        });
    } catch (err) {
        // 개시글이 없을때 에러 처리해야함.
        console.log(err);
        response.status(400).json({
            Code: 400,
            message: "채팅방 참가 신청 실패",
        });
    }
}

/*
입장 신청 취소(철회)
Todo : 만약 입장요청 취소와 승인이 동시에 이루어진다면? (Lock을 사용해야 할듯)
*/
async function cancelJoinChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const query: string = `delete from post_want_join where post_id = ? and user_uniq_id = ? `;
    const values = [post_id, user_uniq_id];
    try {
        const [data]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
            query,
            values
        );
        //todo :글이 없을때 계속 요청을 보낼수가 있음.
        console.log(data.affectedRows);
        response.status(200).json({
            status: 200,
            post_id: "채팅방 입장 요청 철회 성공 ",
        });
    } catch (err) {
        if (err) {
            console.log(err);
            response.status(400).json({
                Code: 400,
                message: "채팅방 입장 요청 취소 실패",
            });
            return;
        }
    }
}

/*
채팅방 참가요청 리스트 불러오기
todo : 불러오는 사람이 권한이 있는지 검사, 어떤 데이터들을 보내줄것인지 정하기
*/
async function getEnterRequestChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    try {
        const query: string = `select * from post_want_join join user_require_info on post_want_join.user_uniq_id = user_require_info.user_uniq_id where post_id = ?`;
        const values: string[] = [post_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        response.status(200).json({
            status: 200,
            data: rows,
        });
    } catch (err) {
        console.log(err);
        response.status(400).json({
            Code: 400,
            message: "신청목록 불러오기 실패",
        });
        return;
    }
}

/* 
채팅방 참가 승인 
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
async function agreeEnterChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const applicant_uniq_id: string = "test_1"; //todo : 신청한 사람의 아이디
    const insertQuery: string = `insert into post_participation (post_id, user_uniq_id) values (?,?)`;
    const deleteQuery: string = `delete from post_want_join where post_id = ? and user_uniq_id = ?`;
    const values = [post_id, applicant_uniq_id];
    try {
        await Promise.all([
            pool.execute(insertQuery, values),
            pool.execute(deleteQuery, values),
        ]);

        response.status(200).json({
            status: 200,
            post_id: "채팅방 입장 등록 성공",
        });
    } catch (err) {
        // Todo : 만약 쿼리문이 하나만 성공하고 하나는 실패한다면?
        response.status(400).json({
            status: 400,
            post_id: "채팅방 입장 등록 실패",
        });
    }
}

/* 채팅방 입장 거절 
todo : 요청자가 승인 권한이 있는지 확인해야 함
*/
async function disagreeEnterChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const applicant_uniq_id: string = "test_1"; //todo : 신청한 사람의 아이디를 어떻게 가져올 것인가
    const query: string = `delete from post_want_join where post_id = ? and user_uniq_id = ? `;
    const values = [post_id, applicant_uniq_id];
    try {
        await pool.execute(query, values);
        response.status(200).json({
            status: 200,
            post_id: "채팅방 입장 거절 성공",
        });
    } catch (err) {
        if (err) {
            console.log(err);
            response.status(400).json({
                Code: 400,
                message: "채팅방 입장 거절 실패",
            });
        }
    }
}

/* 채팅방 나가기*/
async function leaveChatroom(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const query: string = `delete from post_participation where post_id = ? and user_uniq_id = ? `;
    const values = [post_id, user_uniq_id];
    try {
        await pool.execute(query, values);
        response.status(200).json({
            status: 200,
            post_id: "채팅방 떠나기 성공",
        });
    } catch (err) {
        console.log(err);
        response.status(400).json({
            status: 400,
            post_id: "채팅방 떠나기 실패",
        });
    }
}

/*
채팅방 맴버 가져오기 
todo : 어떤 정보를 가져올지 정해야됨
*/
async function getChatMembers(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const query: string = `select * from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id = ?`;
    const values = [post_id];
    try {
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        response.status(200).json({
            status: 200,
            data: rows,
        });
    } catch (err) {
        console.log(err);
        response.status(400).json({
            Code: 400,
            message: "신청목록 불러오기 실패",
        });
    }
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
