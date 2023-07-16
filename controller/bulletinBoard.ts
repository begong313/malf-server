/*
bulletinBoard controller
*/

import { Request, Response } from "express";
import { BulletinBoardDAO, postBody } from "../model/bulletinBoard";

function getPostList(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(response);
    bulletinBoardDAO.getPostList();
    return;
}

function createPost(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(response);
    const postBody: postBody = {
        title: request.body.title,
        content: request.body.content,
        capacity_local: request.body.capacity_local,
        capacity_travel: request.body.capacity_travel,
        meeting_location: request.body.meeting_location,
        meeting_start_time: request.body.meeting_start_time,
        user_e_mail: "test@gmail.com",
    };
    bulletinBoardDAO.createPost(postBody);
    return;
}

function getPostDetail(request: Request, response: Response): void {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(response);
    const post_id: number = Number(request.params.id);
    bulletinBoardDAO.getPostDetail(post_id);
    return;
}

function deletePost(request: Request, response: Response) {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(response);
    const post_id: number = Number(request.params.id);
    bulletinBoardDAO.deletePost(post_id);
    return;
}

function picTest(request: Request, response: Response) {
    const bulletinBoardDAO: BulletinBoardDAO = new BulletinBoardDAO(response);
    //todo : 전처리 추가해야 함
    const postBody: postBody = {
        title: request.body.title,
        content: request.body.content,
        capacity_local: request.body.capacity_local,
        capacity_travel: request.body.capacity_travel,
        meeting_location: request.body.meeting_location,
        meeting_start_time: request.body.meeting_start_time,
        user_e_mail: "test@gmail.com",
    };

    const imageFiles: any = request.files;
    var picDIRList: string[] = []; //사진 경로 담을 array

    //첨부사진이 없을 때
    if (imageFiles == undefined) {
        bulletinBoardDAO.createPost(postBody);
        return;
    }

    //사진 dir정보
    for (var i = 0; i < imageFiles.length; i++) {
        picDIRList.push(imageFiles[i].filename);
    }

    bulletinBoardDAO.createPost(postBody, picDIRList);
    return;
}

export { createPost, getPostList, getPostDetail, deletePost, picTest };
