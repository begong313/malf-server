import { Request, Response } from "express";
import { BulletinBoardDAO } from "./DAOBulletinBoard";
import fs from "fs";

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
    const imageBuffer: Buffer = request.body;
    console.log(request);
    fs.writeFile("test1.jpg", imageBuffer, "binary", (err) => {
        if (err) {
            console.log(err);
            response.status(500).send("fail save");
        }
        response.send("saved");
    });
}
export { createPost, getPostList, getPostDetail, deletePost, picTest };
