/* bulletinBoard를 위한 DAO */

import { Response } from "express";
import pool from "../lib/dbConnector";
import { ServerResponse } from "../lib/serverResponse";
import { OkPacket } from "mysql";

//글 생성시 필요한 데이터들
export interface postBody {
    title: string;
    content: string;
    capacity_local: string;
    capacity_travel: string;
    meeting_location: string;
    meeting_start_time: string;
    user_e_mail: string;
}

export class BulletinBoardDAO {
    private serverResponse: ServerResponse; //단일존재패턴으로 바꾸면 되지 않을까?
    private response: Response;

    constructor(response: Response) {
        this.serverResponse = new ServerResponse();
        this.response = response;
    }

    // 글의 list가져오기
    public getPostList(): void {
        this.getPostListQuery();
        return;
    }

    private getPostListQuery(): void {
        const response: Response = this.response;
        const serverresponse: ServerResponse = this.serverResponse;
        pool.query(
            `select post.post_id, post.title, user.nick_name as author_nickname,
                        user.nation as author_nation, user.type as user_type,
                        post.capacity as meeting_capacity, post.picture as meeting_pic,
                        post.location as meeting_location, post.start_time as meeting_start_time
                        from user join post on user.e_mail = post.user_e_mail order by post.post_id`,
            function (err: Error, result: any) {
                if (err) {
                    response.json(serverresponse.FailResponse());
                    return;
                }

                // list 보낼때 사진 하나씩 보내기위해 만듦
                for (var i = 0; i < result.length; i++) {
                    console.log(JSON.parse(result[i].meeting_pic)[0]);
                    result[i].meeting_pic = JSON.parse(
                        result[i].meeting_pic
                    )[0];
                    console.log(result[i]);
                }
                response.json(serverresponse.getOKResponse(result));
                return;
            }
        );
        return;
    }

    // 글쓰기 기능
    public createPost(postBody: postBody, picDIR?: string[]): void {
        if (picDIR == undefined) {
            picDIR = ["1689420845357-762903864.jpeg"];
            //Defalut 사진
        }
        this.createPostQuery(postBody, picDIR);
        return;
    }

    private createPostQuery(postBody: postBody, picDIR: string[]): void {
        const response: Response = this.response;
        const serverResponse: ServerResponse = this.serverResponse;
        pool.query(
            `Insert into post (title, content, picture, capacity, location, start_time, user_e_mail) values (
                    "${postBody.title}",
                    "${postBody.content}",
                    '${JSON.stringify(picDIR)}',
                    "${
                        Number(postBody.capacity_local) +
                        Number(postBody.capacity_travel)
                    }",
                    "${postBody.meeting_location}",
                    "${postBody.meeting_start_time}",
                    "${postBody.user_e_mail}")`,
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
    public getPostDetail(post_id: number): void {
        this.getPostDetailQuery(post_id);
        return;
    }

    private getPostDetailQuery(post_id: number): void {
        const response: Response = this.response;
        const serverResponse: ServerResponse = this.serverResponse;

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
            function (err: Error, result: any) {
                if (err) {
                    response.json(serverResponse.FailResponse());
                    return;
                }
                for (var i = 0; i < result.length; i++) {
                    console.log(JSON.parse(result[i].author_picture)[0]);
                    result[i].author_picture = JSON.parse(
                        result[i].author_picture
                    )[0];
                    console.log(result[i]);
                }
                response.json(serverResponse.getOKResponse(result));
            }
        );
    }

    //글 삭제 기능
    public deletePost(post_id: number): void {
        this.deletePostQuery(post_id);
        return;
    }

    private deletePostQuery(post_id: number): void {
        const response: Response = this.response;
        const serverResponse: ServerResponse = this.serverResponse;
        pool.query(
            `Delete from post where post_id = "${post_id}";`,
            function (err: Error) {
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
