import { Request, Response } from "express";

import Container from "typedi";

import { CommunityModel } from "../models/community.model";

export class CommunityController {
    public community = Container.get(CommunityModel);
    //글 리스트 가져오기
    public getPosts = async (req: Request, res: Response) => {};
    //글 쓰기
    public createPost = async (request: Request, response: Response) => {
        const { user_id } = response.locals.user;
        const { title, content } = request.body;
        const imageFiles: any = request.files;
        var picDIRList: string[] = []; //사진 경로 담을 array
        if (imageFiles != undefined && imageFiles.length != 0) {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].location);
            }
        }

        const post = await this.community.createPost(
            user_id,
            title,
            content,
            JSON.stringify(picDIRList)
        );

        return response.status(201).json({
            status: 201,
            message: "글 작성 성공",
            data: {
                post,
            },
        });
    };
    //글 세부정보 가져오기
    public getPost = async (req: Request, res: Response) => {};
    //글 수정하기
    public updatePost = async (req: Request, res: Response) => {};
    //글 삭제하기
    public deletePost = async (req: Request, res: Response) => {};

    //댓글 가져오기
    public getComments = async (req: Request, res: Response) => {};
    //댓글달기
    public createComment = async (req: Request, res: Response) => {};

    //글 스크랩(좋아요)
    public scrapPost = async (req: Request, res: Response) => {};
    //글 스크랩 취소()
    public unscrapPost = async (req: Request, res: Response) => {};
}
