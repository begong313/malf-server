/* bulletinBoard를 위한 DAO */

import { Request, Response } from "express";
import pool from "./dbConnector";
import { ServerResponse } from "./ServerResponse";
import { OkPacket } from "mysql";
import { stringify } from "querystring";

export class BulletinBoardDAO {
    private serverResponse: ServerResponse;
    private request: Request;
    private response: Response;

    constructor(request: Request, response: Response) {
        this.serverResponse = new ServerResponse();
        this.request = request;
        this.response = response;
    }

    // 글의 list가저올때 동작
    public getPostList(): void {
        this.getPostListQuery();
        return;
    }

    private getPostListQuery(): void {
        const response = this.response;
        const serverresponse = this.serverResponse;
        pool.query(
            `select post.post_id, post.title, user.nick_name as author_nickname,
                        user.nation as author_nation, user.type as user_type,
                        post.capacity as meeting_capacity, post.picture as meeting_pic,
                        post.location as meeting_location, post.start_time as meeting_start_time
                        from user join post on user.e_mail = post.user_e_mail order by post.post_id`,
            function (err: Error, result: OkPacket) {
                if (err) {
                    response.json(serverresponse.FailResponse());
                    return;
                }
                response.json(serverresponse.getOKResponse(result));
                return;
            }
        );
        return;
    }

    // 글쓰기 기능
    public createPost(picDIR?: string[]): void {
        if (picDIR == undefined) {
            picDIR = ["1689420845357-762903864.jpeg"];
            //Defalut 사진
        }
        this.createPostQuery(picDIR);
        return;
    }

    private createPostQuery(picDIR: string[]): void {
        const request = this.request;
        const response = this.response;
        const serverResponse = this.serverResponse;
        pool.query(
            `Insert into post (title, content, picture, capacity, location, start_time, user_e_mail) values (
                    "${request.body.title}",
                    "${request.body.content}",
                    '${JSON.stringify(picDIR)}',
                    "${
                        Number(request.body.capacity_local) +
                        Number(request.body.capacity_travel)
                    }",
                    "${request.body.meeting_location}",
                    "${request.body.meeting_start_time}",
                    "test@gmail.com")`,
            function (err: Error, result: OkPacket) {
                if (err) {
                    console.log(err);
                    response.json(serverResponse.FailResponse());
                    return;
                }
                response.json(serverResponse.postOKResponse(result.insertId));
                return;
            }
        );
    }

    //글 상세보기 기능
    public getPostDetail(): void {
        const post_id: number = Number(this.request.params.id);
        this.getPostDetailQuery(post_id);
        return;
    }

    private getPostDetailQuery(post_id: number): void {
        const response = this.response;
        const serverResponse = this.serverResponse;

        if (post_id == 2) {
            response.json(serverResponse.FailResponse());
            return;
        }
        pool.query(
            `select
                post.post_id, post.title, post.content, user.nick_name as author_nickname,
                user.nation as author_nation, user.picture as author_picture, user.type as user_type,
                post.capacity as meeting_capacity, post.picture as meeting_pic, post.location as meeting_location,
                post.start_time as meeting_start_time, post.like_count, post.like_check, post.participantion_status
                from post join user on post.user_e_mail = user.e_mail
                where post_id = "${post_id}"`,
            function (err: Error, result: OkPacket) {
                if (err) {
                    response.json(serverResponse.FailResponse());
                    return;
                }
                response.json(serverResponse.getOKResponse(result));
            }
        );
    }

    //글 삭제 기능
    public deletePost(): void {
        const post_id: number = Number(this.request.params.id);
        this.deletePostQuery(post_id);
        return;
    }

    private deletePostQuery(post_id: number): void {
        const response = this.response;
        const serverResponse = this.serverResponse;
        pool.query(
            `Delete from post where post_id = "${post_id}";`,
            function (err: Error, result: OkPacket) {
                if (err) {
                    response.json(serverResponse.FailResponse());
                    return;
                }
                response.json(serverResponse.deleteOKResponse());
            }
        );
        return;
    }
}
