import { Service } from "typedi";
import pool from "../lib/dbConnector";
import { FieldPacket, ResultSetHeader } from "mysql2";

@Service()
export class CommunityModel {
    public getPosts = async (limit: number, offset: number) => {
        try {
            const query: string = this.getGetPostsQuery();
            const values = [String(limit), String((offset - 1) * limit)];
            const [rows]: [any, FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };

    //글생성
    public createPost = async (
        user_id: string,
        title: string,
        content: string,
        picDIRList: string
    ) => {
        try {
            const query: string = this.getCreatePostQuery();
            const values = [user_id, title, content, picDIRList];
            const [rows]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
                query,
                values
            );
            const post_id: number = rows.insertId;
            return post_id;
        } catch (err) {
            console.log(err);
        }
    };
    //글 세부정보 가져오기
    public getPost = async (user_uniq_id: string, post_id: string) => {
        try {
            const query: string = this.getGetPostQuery();
            const values = [user_uniq_id, post_id];
            const [rows]: [any, FieldPacket[]] = await pool.execute(
                query,
                values
            );
            if (rows.length == 0) {
                return -1;
            }
            return rows;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };
    public updatePost = async (
        post_id: string,
        title: string,
        content: string,
        picDIRList: string
    ) => {
        try {
            const query: string = this.getUpdatePostQuery();
            const values = [title, content, picDIRList, new Date(), post_id];
            await pool.execute(query, values);
            return post_id;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };
    public deletePost = async (post_id: string) => {
        try {
            const query: string = this.getDeletePostQuery();
            const values = [post_id];
            await pool.execute(query, values);
            return post_id;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };

    //community글에 댓글달기
    public createReply = async (
        post_id: string,
        user_id: string,
        content: string
    ) => {
        try {
            const query: string = this.getCreateReplyQuery();
            const values = [post_id, user_id, content];
            const [rows]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
                query,
                values
            );
            const reply_id: number = rows.insertId;
            return reply_id;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };
    public getReply = async (
        post_id: string,
        limit: number,
        offset: number
    ) => {
        try {
            const query: string = this.getGetReplyQuery();
            const values = [
                post_id,
                String(limit),
                String((offset - 1) * limit),
            ];
            const [rows]: [any, FieldPacket[]] = await pool.execute(
                query,
                values
            );

            return rows;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };

    public addScrap = async (post_id: string, user_uniq_id: string) => {
        try {
            const query: string = this.getAddScrapQuery();
            const values = [post_id, user_uniq_id];
            await pool.execute(query, values);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };
    public deleteScrap = async (post_id: string, user_uniq_id: string) => {
        try {
            const query: string = this.getDeleteScrapQuery();
            const values = [post_id, user_uniq_id];
            await pool.execute(query, values);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    ///////////////////////query/////////////////////////
    private getGetPostsQuery = (): string => {
        const query: string = `select post_id, title, content, picture, r.nickname as author_nickname, r.user_type , c.user_uniq_id, i.status, c.create_at, c.update_at,
                                (select count(*) from community_reply where community_post_id = c.post_id) as reply_count, post_status, create_at, update_at
                                from community as c join user_require_info as r on c.user_uniq_id = r.user_uniq_id join user_id as i on c.user_uniq_id = i.user_uniq_id
                                order by create_at desc
                                Limit ? offset ?;
                                `;
        return query;
    };
    private getCreatePostQuery = (): string => {
        const query: string =
            "insert into community (user_uniq_id, title, content, picture) values (?, ?, ?, ?)";
        return query;
    };
    private getGetPostQuery = (): string => {
        const query: string = `select c.post_id, title, content, picture, r.nickname as author_nickname, r.user_type , c.user_uniq_id, i.status, c.create_at, c.update_at,(select count(*) from community_reply where community_post_id = c.post_id) as reply_count,
                                (case when exists (select 1 from community_scrap as s where s.post_id = c.post_id and s.user_uniq_id = ?)then 1 else 0 end) as scrap_check, a.profile_pic as author_picture             
                                from community as c join user_require_info as r on c.user_uniq_id = r.user_uniq_id join user_id as i on c.user_uniq_id = i.user_uniq_id join user_additional_info as a on c.user_uniq_id = a.user_uniq_id
                                where c.post_id=?;`;
        return query;
    };
    private getUpdatePostQuery = (): string => {
        const query: string =
            "update community set title=?, content=?, picture=?, update_at = ? where post_id=?";
        return query;
    };
    private getDeletePostQuery = (): string => {
        const query: string = "delete from community where post_id=?";
        return query;
    };
    private getCreateReplyQuery = (): string => {
        const query: string =
            "insert into community_reply (community_post_id, user_uniq_id, content) values (?, ?, ?)";
        return query;
    };
    private getGetReplyQuery = (): string => {
        const query: string = `SELECT c.reply_id, c.content, r.nickname AS author_nickname, r.user_type, c.user_uniq_id, i.status, c.create_at, c.update_at,
                                (
                                    SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        're_reply_id', b.reply_id,
                                        'content', b.content,
                                        'author_nickname', a.nickname,
                                        'user_type', a.user_type,
                                        'user_uniq_id', b.user_uniq_id,
                                        'status', d.status,
                                        'create_at', b.create_at,
                                        'update_at', b.update_at
                                    )
                                    )
                                    FROM community_re_reply AS b
                                    JOIN user_require_info AS a ON b.user_uniq_id = a.user_uniq_id
                                    JOIN user_id AS d ON d.user_uniq_id = b.user_uniq_id
                                    WHERE b.reply_id = c.reply_id
                                ) AS re_reply
                                FROM
                                community_reply AS c
                                JOIN
                                user_require_info AS r ON c.user_uniq_id = r.user_uniq_id
                                JOIN
                                user_id AS i ON c.user_uniq_id = i.user_uniq_id
                                WHERE
                                c.community_post_id = ?
                                order by c.create_at
                                Limit ? offset ? ;`;
        return query;
    };
    private getAddScrapQuery = (): string => {
        const query: string = `insert into community_scrap (post_id, user_uniq_id) values (?, ?);`;
        return query;
    };
    private getDeleteScrapQuery = (): string => {
        const query: string = `delete from community_scrap where post_id=? and user_uniq_id=?;`;
        return query;
    };
}
