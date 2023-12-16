import { Service } from "typedi";
import pool from "../lib/dbConnector";
import { FieldPacket, ResultSetHeader } from "mysql2";

@Service()
export class CommunityModel {
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

    ///////////////////////query/////////////////////////
    private getCreatePostQuery = (): string => {
        const query: string =
            "insert into community (user_uniq_id, title, content, picture) values (?, ?, ?, ?)";
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
}
