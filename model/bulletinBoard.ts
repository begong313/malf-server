import { Request, Response } from "express";
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

export { createPost, getPostList, getPostDetail, deletePost };
