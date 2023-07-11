import { Request, Response } from "express";
//import mysql from 'mysql';
//import dotenv from 'dotenv';
// import path from "path";

function getPostList(req: Request, res: Response) {
    console.log(req.body);
    const testJson: any = {
        status: "OK",
        data: [
            {
                post_id: 0,
                title: "I want to go to Gyeongbokgung",
                author_nicname: "jay park",
                author_nation: "810",
                user_type: 1,
                meeting_capacity: 10,
                meeting_pic: "https://zrr.kr/kYMd",
                meeting_location: "경복궁역",
                metting_start_time: "2023-03-01 16:00:00",
            },
            {
                post_id: 1,
                title: "경복궁 가실분",
                author_nicname: "이영지",
                author_nation: "410",
                user_type: 0,
                meeting_capacity: 8,
                meeting_pic: "https://zrr.kr/GDKn",
                meeting_location: "경복궁역",
                metting_start_time: "2023-06-11 19:00:00",
            },
            {
                post_id: 2,
                title: "에러 테스트 글",
                author_nicname: "Err",
                author_nation: "410",
                user_type: 0,
                meeting_capacity: 8,
                meeting_pic: "https://zrr.kr/GDKn",
                meeting_location: "Err",
                metting_start_time: "2023-06-11 19:00:00",
            },
        ],
    };
    res.json(testJson);
}

function createPost(req: Request, res: Response) {
    console.log(req.body);
    const testJson: any[] = [
        {
            status: "OK",
            post_id: "1",
        },
        {
            status: "fail",
        },
    ];
    res.json(testJson[0]);
}

function getPostDetail(req: Request, res: Response) {
    const post_id: number = Number(req.params.id);
    console.log(post_id);

    if (post_id == 2) {
        res.json({ status: "fail" });
        return;
    }

    const test_data: object[] = [
        {
            post_id: 0,
            title: "I want to go to Gyeongbokgung",
            content: "Go to Gyeongbokgung with hanbok",
            author_nicname: "jay park",
            author_nation: "810",
            author_picture: "https://zrr.kr/FtAb",
            user_type: 1,
            meeting_capacity: 10,
            meeting_pic: ["https://zrr.kr/kYMd", "https://zrr.kr/2eQX"],
            meeting_location: "경복궁역",
            metting_start_time: "2023-03-01 16:00:00",
            like_count: "123",
            like_check: "1",
            participation_status: 0,
        },
        {
            post_id: 1,
            title: "경복궁가실분",
            content: "경복궁가실분 구합니다",
            author_nicname: "이영지",
            author_nation: "410",
            author_picture: "https://zrr.kr/FtAb",
            user_type: 1,
            meeting_capacity: 10,
            meeting_pic: ["https://zrr.kr/GDKn", "https://zrr.kr/2eQX"],
            meeting_location: "경복궁역",
            metting_start_time: "2023-06-11 19:00:00",
            like_count: "1223",
            like_check: "0",
            participation_status: 0,
        },
    ];

    const testJson: any = {
        status: "OK",
        data: test_data[post_id],
    };

    res.json(testJson);
}

export { createPost, getPostList, getPostDetail };
