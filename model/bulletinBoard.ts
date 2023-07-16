import { Request, Response, response } from "express";
import { BulletinBoardDAO } from "./DAOBulletinBoard";

function getPostList(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(
        request,
        response
    );
    bulletinBoardDAO.getPostList();
    return;
}

function createPost(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(
        request,
        response
    );
    bulletinBoardDAO.createPost();
    return;
}

function getPostDetail(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(
        request,
        response
    );
    bulletinBoardDAO.getPostDetail();
    return;
}

function deletePost(request: Request, response: Response) {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(
        request,
        response
    );
    bulletinBoardDAO.deletePost();
}

function picTest(request: Request, response: Response) {
    // 전처리 및 파일저장
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(
        request,
        response
    );
    //첨부사진이 없을 때
    if (request.files == undefined) {
        bulletinBoardDAO.createPost();
        return;
    }
    console.log(typeof request.files);
    const imageFiles: any = request.files;
    var picDIRList: string[] = [];

    //사진 dir정보
    for (var i = 0; i < imageFiles.length; i++) {
        picDIRList.push(imageFiles[i].filename);
    }

    bulletinBoardDAO.createPost(picDIRList);
}
export { createPost, getPostList, getPostDetail, deletePost, picTest };
