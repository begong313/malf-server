import { NextFunction, Request, Response } from "express";

import Container from "typedi";

import { CommunityModel } from "../models/community.model";
import StatusChecker from "../lib/statusChecker";
import RightChecker from "../lib/rightChecker";
import { HttpException } from "../exeptions/HttpException";
import { request } from "http";

export class CommunityController {
    public community = Container.get(CommunityModel);
    //글 리스트 가져오기
    public getPosts = async (req: Request, res: Response) => {
        try {
            const limit: number = Number(req.query.limit) || 10;
            const page: number = Number(req.query.page) || 1;
            const posts = await this.community.getPosts(limit, page);
            res.status(200).json({ status: 200, data: posts });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //글 쓰기
    public createPost = async (request: Request, response: Response) => {
        try {
            const user_uniq_id = response.locals.decoded;
            const { title, content } = request.body;
            const imageFiles: any = request.files;
            var picDIRList: string[] = []; //사진 경로 담을 array
            if (imageFiles != undefined && imageFiles.length != 0) {
                //사진 dir정보
                for (var i = 0; i < imageFiles.length; i++) {
                    picDIRList.push(imageFiles[i].location);
                }
            }
            const post_id = await this.community.createPost(
                user_uniq_id,
                title,
                content,
                JSON.stringify(picDIRList)
            );

            return response.status(201).json({
                status: 201,
                post_id: post_id,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //글 세부정보 가져오기
    public getPost = async (req: Request, res: Response) => {
        try {
            const user_uniq_id = res.locals.decoded;
            const post_id = req.params.post_id;

            const post = await this.community.getPost(user_uniq_id, post_id);
            const reply = await this.community.getReply(post_id, 10, 1);

            if (post == -1) {
                res.status(500).json({ status: 500, message: "없는글" });
                return;
            }
            //본문에 댓글 추가
            post[0].reply = reply;

            res.status(200).json({ status: 200, data: post });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "서버 에러" });
        }
    };

    //글 수정하기
    public updatePost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const user_uniq_id = response.locals.decoded;
            const post_id = request.params.post_id;
            const { title, content } = request.body;
            const imageFiles: any = request.files;
            var picDIRList: string[] = []; //사진 경로 담을 array
            if (imageFiles != undefined && imageFiles.length != 0) {
                //사진 dir정보
                for (var i = 0; i < imageFiles.length; i++) {
                    picDIRList.push(imageFiles[i].location);
                }
            }
            //권한체크
            const userStatusCode: number = await StatusChecker.getStatus(
                user_uniq_id
            );
            //superuser일 경우 pass
            if (userStatusCode != 100) {
                if (
                    !(await RightChecker.communityRightCheck(
                        user_uniq_id,
                        post_id
                    ))
                ) {
                    next(new HttpException(401, "권한이 없습니다"));
                    return;
                }
            }

            const results = await this.community.updatePost(
                post_id,
                title,
                content,
                JSON.stringify(picDIRList)
            );
            if (results == -1) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
                post_id: results,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //글 삭제하기
    public deletePost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const user_uniq_id = response.locals.decoded;
            const post_id = request.params.post_id;
            //권한체크
            const userStatusCode: number = await StatusChecker.getStatus(
                user_uniq_id
            );
            if (userStatusCode != 100) {
                if (
                    !(await RightChecker.communityRightCheck(
                        user_uniq_id,
                        post_id
                    ))
                ) {
                    next(new HttpException(401, "권한이 없습니다"));
                    return;
                }
            }
            await this.community.deletePost(post_id);
            return response.status(201).json({
                status: 200,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };

    //댓글 가져오기
    public getReply = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const post_id = request.params.post_id;
            const limit: number = Number(request.query.limit) || 10;
            const page: number = Number(request.query.page) || 1;
            console.log(limit, page);
            const reply = await this.community.getReply(post_id, limit, page);
            if (reply == -1) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 200,
                data: reply,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };

    //댓글달기
    public createReply = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const post_id = request.params.post_id;
        const { content } = request.body;

        try {
            const reply_id = await this.community.createReply(
                post_id,
                user_uniq_id,
                content
            );
            if (reply_id == -1) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
                data: reply_id,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //댓글 삭제
    public deleteReply = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const reply_id = request.params.reply_id;

        try {
            const userStatusCode: number = await StatusChecker.getStatus(
                user_uniq_id
            );
            if (userStatusCode != 100) {
                if (
                    !(await RightChecker.communityRelpyRightCheck(
                        user_uniq_id,
                        reply_id
                    ))
                ) {
                    next(new HttpException(401, "권한이 없습니다"));
                    return;
                }
            }

            const results = await this.community.deleteReply(reply_id);
            if (results == -1) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //댓글 수정
    public updateReply = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const reply_id = request.params.reply_id;
        const { content } = request.body;

        try {
            const userStatusCode: number = await StatusChecker.getStatus(
                user_uniq_id
            );
            if (userStatusCode != 100) {
                if (
                    !(await RightChecker.communityRelpyRightCheck(
                        user_uniq_id,
                        reply_id
                    ))
                ) {
                    next(new HttpException(401, "권한이 없습니다"));
                    return;
                }
            }

            const results = await this.community.updateReply(
                reply_id,

                content
            );
            if (results == -1) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };

    //글 스크랩(좋아요)
    public scrapPost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const post_id = request.params.post_id;

        try {
            const results = await this.community.addScrap(
                post_id,
                user_uniq_id
            );
            if (results == false) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
    //글 스크랩 취소()
    public unscrapPost = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const post_id = request.params.post_id;

        try {
            const results = await this.community.deleteScrap(
                post_id,
                user_uniq_id
            );
            if (results == false) {
                next(new HttpException(500, "서버 에러"));
                return;
            }
            return response.status(201).json({
                status: 201,
            });
        } catch (err) {
            console.log(err);
            response.status(500).json({ status: 500, message: "서버 에러" });
        }
    };
}
