import { Request, Response } from "express";

import Container from "typedi";

import { CommunityModel } from "../models/community.model";

export class CommunityController {
    public community = Container.get(CommunityModel);
    //글 리스트 가져오기
    public getPosts = async (req: Request, res: Response) => {};
    //글 쓰기
    public createPost = async (req: Request, res: Response) => {};
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
