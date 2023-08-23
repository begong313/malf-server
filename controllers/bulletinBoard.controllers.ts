/*
bulletinBoard controller
*/

import { NextFunction, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { HttpException } from "../exeptions/HttpException";
import BulletinBoardModel from "../models/bulletinBoard.model";
import { Container } from "typedi";

export class BulletinBoardController {
    public bulletinBoard = Container.get(BulletinBoardModel);

    public loadPostList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        console.log(this.bulletinBoard);
        const page: number = Number(request.query.page) || 1;
        const limit: number = Number(request.query.limit) || 100;

        console.log(await this.bulletinBoard.loadPostList(page, limit));
        const rows: RowDataPacket[] = await this.bulletinBoard.loadPostList(
            page,
            limit
        );

        response.status(200).json({
            status: 200,
            data: rows,
        });
    };

    /*
    개시글 작성
    */
    public createPost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        //todo : 전처리 추가해야 함

        const imageFiles: any = request.files;
        var picDIRList: string[] = []; //사진 경로 담을 array
        //첨부사진이 없을 때

        console.log("Header", request);
        console.log("imagefile?", request.files);
        if (imageFiles == undefined) {
            picDIRList.push("default.jpeg");
        } else {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].filename);
            }
        }
        const postBody = {
            title: request.body.title,
            content: request.body.content,
            capacity_local: request.body.capacity_local,
            capacity_travel: request.body.capacity_travel,
            meeting_location: request.body.meeting_location,
            meeting_start_time: request.body.meeting_start_time,
            user_uniq_id: response.locals.decoded,
            category: request.body.category, // 1~8 validation 추가해야함
            picDIRList: JSON.stringify(picDIRList),
        };

        const post_id: number = await this.bulletinBoard.createPost(postBody);

        response.status(200).json({
            status: 200,
            post_id: post_id,
        });
    };

    /*
    개시글 상세보기
    */
    public loadPostDetail = async (
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        const post_id: string = request.params.id;
        const user_uniq_id: any = response.locals.decoded;

        try {
            const rows = await this.bulletinBoard.loadPostDetail(
                post_id,
                user_uniq_id
            );
            if (rows.length == 0) {
                next(new HttpException(404, "없는 글입니다."));
                return;
            }
            response.status(200).json({
                status: 200,
                data: rows,
            });
        } catch (err) {
            next(new HttpException(400, "글 조회 실패"));
        }
    };

    /*개시글 수정 */
    public updatePost = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        /*todo*/
    };

    /*
    개시글 삭제
    */
    public deletePost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        // todo : 사용자가 글의 작성자인지 확인하는 검사 필요
        const post_id: string = request.params.id;
        const user_uniq_id: string = response.locals.decoded;

        try {
            const rows = await this.bulletinBoard.userIDSearch(post_id);
            if (rows.length == 0) {
                next(new HttpException(404, "없는 글입니다."));
                return;
            }
            if (rows[0].user_uniq_id != user_uniq_id) {
                next(new HttpException(401, "권한이 없습니다"));
                return;
            }

            this.bulletinBoard.deletePost(post_id);
            response.status(200).json({
                status: 200,
                message: "글 삭제 성공",
            });
        } catch (err) {
            next(new HttpException(400, "글 삭제 실패"));
        }
    };

    /*좋아요 버튼 눌렀을때의 동작 */
    public pushLike = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const post_id: string = request.params.id;
        const user_uniq_id = response.locals.decoded;

        try {
            const rows = await this.bulletinBoard.searchLike(
                post_id,
                user_uniq_id
            );
            if (rows.length == 0) {
                await this.bulletinBoard.setlike(post_id, user_uniq_id);
                response.status(200).json({
                    status: 200,
                    message: "좋아요 등록 성공",
                });
                return;
            }
            await this.bulletinBoard.deletelike(post_id, user_uniq_id);
            response.status(200).json({
                status: 200,
                message: "좋아요 삭제성공",
            });
        } catch (err) {
            next(new HttpException(400, "좋아요 처리 에러"));
        }
    };

    /*todos
    1. 주석
    2. 좋아요 누름과 동시에 Db에서 글이 삭제될때 lock
    */
}

/*
개시글 리스트 불러오기 

*/