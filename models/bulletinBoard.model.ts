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
        try {
            const query: string = this.getLoadPostListQuery();
            const values = [String(limit), String((page - 1) * limit)];
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    //category_id를 받아서 해당 카테고리의 게시글을 가져옴
    public loadPostListWithCategory = async (
        page: number,
        limit: number,
        category: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getLoadPostListWithCategoryQuery();
            const values = [
                category,
                String(limit),
                String((page - 1) * limit),
            ];
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
            return [];
        }
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
        try {
            const [results]: [ResultSetHeader, FieldPacket[]] =
                await pool.execute(query, values);
            const post_id: number = results.insertId;
            const chatEnterQuery =
                "insert into post_participation (post_id, user_uniq_id) values (?,?)";
            await pool.execute(chatEnterQuery, [
                post_id,
                postBody.user_uniq_id,
            ]);
            ////

            return post_id;
        } catch (err) {
            console.log(err);
        }
        //에러처리 필요함 1. 글이 등록 실패했을때, 2. 글등록은됐는데 채팅방에 안들어가졌을때.
        return 0;
        //나중에 chat부분으로 따로 빼야됨~~~~
    };

    public loadPostDetail = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getLoadPostDetailQuery();
            const values = { post_id, user_uniq_id };
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    public updatePost = async (
        post_id: string,
        postBody: any
    ): Promise<number> => {
        try {
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

            const [results]: [ResultSetHeader, FieldPacket[]] =
                await pool.execute(query, values);

            return results.insertId;
        } catch (err) {
            console.log(err);
            return -1;
        }
    };

    public deletePost = async (post_id: string) => {
        const query = this.getDeleteQuery();
        const values = [post_id];
        try {
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    public searchLike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getDetectLikeQuert();
            const values = [post_id, user_uniq_id];
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    public setlike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        try {
            const query: string = this.getInsertLikeQuert();
            const values = [post_id, user_uniq_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    public deletelike = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        try {
            const query: string = this.getDeleteLikeQuert();
            const values = [post_id, user_uniq_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    public changeStatus = async (post_id: string): Promise<void> => {
        try {
            const query: string = this.getChangeStatusQuery();
            const values = [post_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    private getLoadPostListQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id, post.category_id as category, post.post_status as post_status,
        (select count(*) from post_like where post_id = post.post_id )as like_count,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 0 )as local_participation,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 1 )as travel_participation
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id 
        where post.post_status = 1
        order by post.post_id desc
        Limit ? offset ? `;
        return query;
    }

    //현재는 마감된 글은 리스트에 안보임, post_status항목을 조절해서 컨트롤 가능할듯
    private getLoadPostListWithCategoryQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id,post.category_id as category, post.post_status as post_status,
        (select count(*) from post_like where post_id = post.post_id )as like_count,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 0 )as local_participation,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 1 )as travel_participation
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id 
        where post.category_id = ? and post.post_status = 1
        order by post.post_id desc
        Limit ? offset ? `;
        return query;
    }

    private getCreateQuery(): string {
        const query: string =
            "insert into post (title, content, picture, capacity_local,capacity_travel, location, start_time, user_uniq_id, category_id) values(?,?,?,?,?,?,?,?,?)";
        return query;
    }
    private getLoadPostDetailQuery(): string {
        const query: string = `select post.post_id, post.title, post.content, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_additional_info.profile_pic as author_picture, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic, post.location as meeting_location,
        post.start_time as meeting_start_time, post.category_id as category, post.user_uniq_id, post.post_status as post_status,
        (select count(*) from post_like where post_id = :post_id )as like_count,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 0 )as local_participation,
        (select count(*) from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id=post.post_id and user_type = 1 )as travel_participation,
        (case when exists (select 1 from post_like where post_id = :post_id and user_uniq_id = :user_uniq_id)then 1 else 0 end) as like_check, 
        (case when exists (select 1 from post_participation where post_id = :post_id and user_uniq_id = :user_uniq_id)then 1 else 0 end) as participation_status
        from post join user_require_info on post.user_uniq_id = user_require_info.user_uniq_id join user_additional_info on post.user_uniq_id = user_additional_info.user_uniq_id
        where post_id = :post_id `;
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
    //글 status 변경 query
    private getChangeStatusQuery(): string {
        const query: string = `update post set post_status = 2 where post_id = ?`;
        return query;
    }
}

export default BulletinBoardModel;
