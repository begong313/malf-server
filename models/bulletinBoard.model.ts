/* 작성필요 */

import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
import { Service } from "typedi";

@Service()
class BulletinBoardModel {
    public loadPostList = async (
        page: number,
        limit: number
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getLoadPostListQuery();
        const values = [String(limit), String((page - 1) * limit)];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };
    public createPost = async (postBody: any): Promise<number> => {
        const query: string = this.getCreateQuery();
        const values = [
            postBody.title,
            postBody.content,
            postBody.picDIRList,
            postBody.capacity_local,
            postBody.capacity_travel,
            postBody.meeting_location,
            postBody.meeting_start_time,
            postBody.user_uniq_id,
            postBody.category,
        ];
        //에러처리 필요함 1. 글이 등록 실패했을때, 2. 글등록은됐는데 채팅방에 안들어가졌을때.
        const [results]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
            query,
            values
        );
        const post_id: number = results.insertId;

        //나중에 chat부분으로 따로 빼야됨~~~~
        const chatEnterQuery =
            "insert into post_participation (post_id, user_uniq_id) values (?,?)";
        await pool.execute(chatEnterQuery, [post_id, postBody.user_uniq_id]);
        ////

        return post_id;
    };

    public loadPostDetail = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getLoadPostDetailQuery();
        const values = { post_id, user_uniq_id };
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };

    public userIDSearch = async (post_id: string): Promise<RowDataPacket[]> => {
        const query: string = this.getUserIDSearchQuery();
        const values = [post_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };
    public updatePost = async (
        post_id: string,
        postBody: any
    ): Promise<number> => {
        const query = this.getUpdateQuery();

        const values = [
            postBody.title,
            postBody.content,
            postBody.picDIRList,
            postBody.capacity_local,
            postBody.capacity_travel,
            postBody.meeting_location,
            postBody.meeting_start_time,
            postBody.category,
            post_id,
        ];
        await pool.execute(query, values);

        const [results]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
            query,
            values
        );

        return results.insertId;
    };

    public deletePost = async (post_id: string) => {
        const query = this.getDeleteQuery();
        const values = [post_id];
        await pool.execute(query, values);
    };

    public searchLike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getDetectLikeQuert();
        const values = [post_id, user_uniq_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };

    public setlike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getInsertLikeQuert();
        const values = [post_id, user_uniq_id];
        await pool.execute(query, values);
    };

    public deletelike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getDeleteLikeQuert();
        const values = [post_id, user_uniq_id];
        await pool.execute(query, values);
    };

    private getLoadPostListQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id order by post.post_id 
        Limit ? offset ? ORDER BY post.post_id desc`;
        return query;
    }
    private getCreateQuery(): string {
        const query: string =
            "insert into post (title, content, picture, capacity_local,capacity_travel, location, start_time, user_uniq_id, category_id) values(?,?,?,?,?,?,?,?,?)";
        return query;
    }
    private getLoadPostDetailQuery(): string {
        const query: string = `select
        post.post_id, post.title, post.content, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_additional_info.profile_pic as author_picture, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic, post.location as meeting_location,
        post.start_time as meeting_start_time, post.category_id as category, post.user_uniq_id,
        (select count(*) from post_like where post_id = :post_id )as like_count,
        (case when exists (select 1 from post_like where post_id = :post_id and user_uniq_id = :user_uniq_id)then 1 else 0 end) as like_check, 
        (case when exists (select 1 from post_participation where post_id = :post_id and user_uniq_id = :user_uniq_id)then 1 else 0 end) as participation_status
        from post join user_require_info on post.user_uniq_id = user_require_info.user_uniq_id join user_additional_info on post.user_uniq_id = user_additional_info.user_uniq_id
        where post_id = :post_id `;
        return query;
    }
    private getUserIDSearchQuery(): string {
        const query: string = "select user_uniq_id from post where post_id = ?";
        return query;
    }
    private getUpdateQuery(): string {
        const query: string =
            "update post set title = ?, content = ?, picture = ?, capacity_local = ?, capacity_travel= ?, location = ?, start_time = ?, category_id = ? where post_id = ?";
        return query;
    }
    private getDeleteQuery(): string {
        const query: string = "Delete from post where post_id = ?";
        return query;
    }

    private getDetectLikeQuert(): string {
        const query: string = `select * from post_like where post_id = ? and user_uniq_id = ?`;
        return query;
    }
    private getInsertLikeQuert(): string {
        const query: string = `insert into post_like (post_id, user_uniq_id) values (?, ?)`;
        return query;
    }
    private getDeleteLikeQuert(): string {
        const query: string = `delete from post_like where post_id = ? and user_uniq_id = ?`;
        return query;
    }
}

export default BulletinBoardModel;
