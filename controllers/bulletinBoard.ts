/*
bulletinBoard controller
*/

import { Request, Response } from "express";
import pool from "../lib/dbConnector";
import { MysqlError, OkPacket } from "mysql";

/*
개시글 리스트 불러오기 
todo : page-nation
*/
function getPostList(request: Request, response: Response): void {
    pool.query(
        `select post.post_id, post.title, user_require_info.nick_name as author_nickname,
    user_require_info.nation as author_nation, user_require_info.user_type as user_type,
    post.capacity as meeting_capacity, post.picture as meeting_pic,
    post.location as meeting_location, post.start_time as meeting_start_time
    from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id order by post.post_id`,
        (err: MysqlError, results: OkPacket) => {
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

/*
개시글 작성
*/
function createPost(request: Request, response: Response) {
    //todo : 전처리 추가해야 함, 사용자 uniq_id가져와서 글 써야함, category설정 필요
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            Code: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    const postBody = {
        title: request.body.title,
        content: request.body.content,
        capacity_local: request.body.capacity_local,
        capacity_travel: request.body.capacity_travel,
        meeting_location: request.body.meeting_location,
        meeting_start_time: request.body.meeting_start_time,
        user_uniq_id: request.headers.authorization, //test용 코드. 추후 header에서 값 추출 필요
        category: request.body.category, // 카테고리는 미완성임
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
            "${postBody.user_uniq_id}",
            "${postBody.category}")`,
        (err: MysqlError, results: OkPacket) => {
            // 글쓴이는 바로 채팅방 입장
            pool.query(
                `insert into post_participation (post_id, user_uniq_id) values ("${results.insertId}","${postBody.user_uniq_id}")`,
                (err: MysqlError, results: OkPacket) => {
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

/*
개시글 상세보기
*/
function getPostDetail(request: Request, response: Response): void {
    const post_id: string = request.params.id;
    const user_uniq_id: any = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            Code: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    pool.query(
        `select
            post.post_id, post.title, post.content, user_require_info.nick_name as author_nickname,
            user_require_info.nation as author_nation, user_additional_info.profile_pic as author_picture, user_require_info.user_type as user_type,
            post.capacity as meeting_capacity, post.picture as meeting_pic, post.location as meeting_location,
            post.start_time as meeting_start_time, post.category_id as category,
            (select count(*) from post_like where post_id = "${post_id}")as like_count,
            (case when exists (select 1 from post_like where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}")then 1 else 0 end) as like_check, 
            (case when exists (select 1 from post_participation where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}")then 1 else 0 end) as participation_status
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

/*개시글 수정 */

function updatePost(request: Request, response: Response) {
    /*todo*/
}

/*
개시글 삭제
*/
function deletePost(request: Request, response: Response) {
    // todo : 사용자가 글의 작성자인지 확인하는 검사 필요
    const post_id: string = request.params.id;
    pool.query(
        `select user_uniq_id from post where post_id = "${post_id}"`,
        (err: MysqlError, results: any) => {
            if (results.length == 0) {
                response.status(400).json({
                    status: 400,
                    message: " 존재하지 않는 글입니다",
                });
                return;
            }
            if (results[0].user_uniq_id != request.headers.authorization) {
                response.status(400).json({
                    status: 400,
                    message: " 권한이 없습니다.",
                });
                return;
            }
            pool.query(
                `Delete from post where post_id = "${post_id}";`,
                function (err: MysqlError) {
                    if (err) {
                        response.status(400).json({
                            status: 400,
                            message: "글 삭제 실패",
                        });
                        return;
                    }
                    response.status(200).json({
                        status: 200,
                        message: "글 삭제 성공",
                    });
                }
            );
        }
    );
}

/*좋아요 버튼 눌렀을때의 동작 */
function pushLike(request: Request, response: Response) {
    const post_id: string = request.params.id;
    const user_uniq_id = request.headers.authorization; //todo
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            Code: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }

    const selectQuery: string = `select * from post_like where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}"`;
    const insertQuery: string = `insert into post_like (post_id, user_uniq_id) values ("${post_id}", "${user_uniq_id}")`;
    const deleteQuery: string = `delete from post_like where post_id = "${post_id}" and user_uniq_id = "${user_uniq_id}"`;

    pool.query(selectQuery, (err: MysqlError, results: any[]) => {
        if (err) {
            console.log("mysql err", err);
            response.status(400).json({
                status: 400,
                message: "좋아요 여부 탐색 실패",
            });
            return;
        }
        // 좋아요 취소
        if (results.length != 0) {
            pool.query(deleteQuery, (err: MysqlError) => {
                if (err) {
                    console.log("mysql err", err);
                    response.status(400).json({
                        status: 400,
                        message: "좋아요 삭제실패",
                    });
                    return;
                }
                response.status(200).json({
                    status: 200,
                    message: "좋아요 삭제성공",
                });
            });
            return;
        }
        //좋아요 등록
        pool.query(insertQuery, (err: MysqlError) => {
            if (err) {
                console.log("mysql err", err);
                response.status(400).json({
                    status: 400,
                    message: "좋아요 등록실패",
                });
                return;
            }
            response.status(200).json({
                status: 200,
                message: "좋아요 등록 성공",
            });
            return;
        });
    });
}

/*todos
1. 주석
2. 좋아요 누름과 동시에 Db에서 글이 삭제될때 lock
*/
export {
    createPost,
    getPostList,
    getPostDetail,
    updatePost,
    deletePost,
    pushLike,
};
