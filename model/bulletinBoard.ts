import { Request, Response } from "express";
import mysql, { OkPacket } from "mysql";
import dotenv, { DotenvConfigOutput } from "dotenv";
import path from "path";

const result: DotenvConfigOutput = dotenv.config({
    path: path.join(__dirname, "../..", ".env"),
});
if (result.parsed === undefined) {
    throw new Error("Can't load env file!");
} else {
    console.log("Load env file complete");
}

var pool: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DB_NAME,
});

pool.getConnection((error) => {
    if (error) {
        console.error("fail to connect", error);
        return;
    }
    console.log("db connect success");
});

function getPostList(req: Request, res: Response) {
    var resultJson: any = {
        status: "fail",
    };
    console.log(req.body);
    pool.query(
        `select post.post_id, post.title, user.nick_name as author_nickname, 
                user.nation as author_nation, user.type as user_type,
                post.capacity as meeting_capacity, post.picture as meeting_pic, 
                post.location as meeting_location, post.start_time as meeting_start_time 
                from user join post on user.e_mail = post.user_e_mail`,
        function (err: Error, result: any) {
            if (err) {
                res.json(resultJson);
                return;
            }
            resultJson.status = "OK";
            resultJson.data = result;
            console.log(resultJson);
            res.json(resultJson);
            return;
        }
    );
}

function createPost(req: Request, res: Response) {
    const responseJson: any[] = [
        {
            status: "OK",
            post_id: "1",
        },
        {
            status: "fail",
        },
    ];
    pool.query(
        `Insert into post (title, content, picture, capacity, location, start_time, user_e_mail) values (
            "${req.body.title}", 
            "${req.body.content}",
            "https://zrr.kr/gx9b",
            "${
                Number(req.body.capacity_local) +
                Number(req.body.capacity_travel)
            }",
            "${req.body.meeting_location}",
            "${req.body.meeting_start_time}",
            "test@gmail.com")`,
        function (err: Error, result: OkPacket) {
            if (err) {
                console.log(err);
                res.json(responseJson[1]);
                return;
            }
            responseJson[0].post_id = result.insertId;
            res.json(responseJson[0]);
            return;
        }
    );
}

function getPostDetail(req: Request, res: Response) {
    const post_id: number = Number(req.params.id);
    console.log(post_id);

    if (post_id == 2) {
        res.json({ status: "fail" });
        return;
    }
    pool.query(
        `select 
                post.post_id, post.title, post.content, user.nick_name as author_nickname, 
                user.nation as author_nation, user.picture as author_picture, user.type as user_type,
                post.capacity as meeting_capacity, post.picture as meeting_pic, post.location as meeting_location,
                post.start_time as meeting_start_time, post.like_count, post.like_check, post.participantion_status
                from post join user on post.user_e_mail = user.e_mail
                where post_id = "${post_id}"`,
        function (err: Error, result: OkPacket) {
            if (err) {
                res.json({ status: "fail" });
                return;
            }
            console.log(result);
            const testJson: any = {
                status: "OK",
                data: result,
            };

            res.json(testJson);
        }
    );
}

export { createPost, getPostList, getPostDetail };
