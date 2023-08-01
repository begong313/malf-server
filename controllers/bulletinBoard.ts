/*
bulletinBoard controller
*/

import { Request, Response } from "express";
import pool from "../lib/dbConnector";
import { OkPacket } from "mysql";

function getPostList(request: Request, response: Response): void {
    pool.query(
        `select post.post_id, post.title, user_require_info.nick_name as author_nickname,
    user_require_info.nation as author_nation, user_require_info.user_type as user_type,
    post.capacity as meeting_capacity, post.picture as meeting_pic,
    post.location as meeting_location, post.start_time as meeting_start_time
    from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id order by post.post_id`,
        (err, results) => {
            if (err) {
                response.status(400).json({
                    Code: 400,
                    message: "글 조회 실패",
                });
            }
            response.json(results);
        }
    );
}

function createPost(request: Request, response: Response) {
    //todo : 전처리 추가해야 함, 사용자 uniq_id가져와서, 글 써야함.
    const postBody = {
        title: request.body.title,
        content: request.body.content,
        capacity_local: request.body.capacity_local,
        capacity_travel: request.body.capacity_travel,
        meeting_location: request.body.meeting_location,
        meeting_start_time: request.body.meeting_start_time,
        user_uniq_id: "todo",
    };
    const imageFiles: any = request.files;
    var picDIRList: string[] = []; //사진 경로 담을 array
    //첨부사진이 없을 때
    if (imageFiles == undefined) {
        picDIRList.push("default.jpeg");
    } else {
        //사진 dir정보
        for (var i = 0; i < imageFiles.length; i++) {
            picDIRList.push(imageFiles[i].filename);
        }
    }

    pool.query(
        `Insert into post (title, content, picture, capacity, location, start_time, user_uniq_id, category_id) values (    
            "${postBody.title}",
            "${postBody.content}",
            '${JSON.stringify(picDIRList)}',
            "${
                Number(postBody.capacity_local) +
                Number(postBody.capacity_travel)
            }",
            "${postBody.meeting_location}",
            "${postBody.meeting_start_time}",
            "k_2940915568",
            "1")`,
        (err: Error, results: OkPacket) => {
            pool.query(
                `insert into post_participation (post_id, user_uniq_id) values ("${results.insertId}","k_2940915568")`,
                (err: Error, results: OkPacket) => {
                    if (err) {
                        console.log(err);
                        response.status(400).json({
                            Code: 400,
                            message: "글 등록 실패",
                        });
                        return;
                    }
                    response.status(200).json({
                        status: 200,
                        post_id: results.insertId,
                    });
                }
            );
        }
    );
}

function getPostDetail(request: Request, response: Response): void {
    const post_id: string = request.params.id;
    pool.query(
        `select
            post.post_id, post.title, post.content, user_require_info.nick_name as author_nickname,
            user_require_info.nation as author_nation, user_additional_info.profile_pic as author_picture, user_require_info.user_type as user_type,
            post.capacity as meeting_capacity, post.picture as meeting_pic, post.location as meeting_location,
            post.start_time as meeting_start_time, (select count(*) from post_like where post_id = "${post_id}")as like_count,(case when exists (select 1 from post_like where post_id = "${post_id}" and user_uniq_id = "k_2940915568")then 1 else 0 end) as like_check, (case when exists (select 1 from post_participation where post_id = "${post_id}" and user_uniq_id = "k_2940915568")then 1 else 0 end) as participation_status
            from post join user_require_info on post.user_uniq_id = user_require_info.user_uniq_id join user_additional_info on post.user_uniq_id = user_additional_info.user_uniq_id
            where post_id = "${post_id}"`,
        (err, results) => {
            if (err) {
                console.log(err);
                response.status(400).json({
                    status: 400,
                    message: "글 불러오기 실패",
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

function deletePost(request: Request, response: Response) {
    // todo : 사용자가 글의 작성자인지 확인하는 검사 필요
    const post_id: string = request.params.id;
    pool.query(
        `Delete from post where post_id = "${post_id}";`,
        function (err: Error) {
            if (err) {
                response.status(400).json({
                    status: 400,
                    message: "글 삭제 실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
            });
        }
    );
}

export { createPost, getPostList, getPostDetail, deletePost };
