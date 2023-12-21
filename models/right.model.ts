import { use } from "passport";
import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";

class RightModel {
    public static postRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getPostsUserIDSearchQuery();
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

    public static chatRightCheck = async (
        user_uniq_id: string,
        chat_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getChatRoomUserIdSearchQuery();
            const values = [chat_id, user_uniq_id];
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
    public static communityRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getCommunityUserIDSearchQuery();
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

    public static communityReplyRightCheck = async (
        user_uniq_id: string,
        reply_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getCommunityReplyUserIDSearchQuery();
            const values = [reply_id, user_uniq_id];
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

    private static getPostsUserIDSearchQuery(): string {
        const query: string = `select count(*) >0 as result from post where post_id = ? and user_uniq_id = ?`;
        return query;
    }

    private static getChatRoomUserIdSearchQuery(): string {
        const query: string = `select count(*) >0 as result from post_participation where post_id = ? and user_uniq_id = ?`;
        return query;
    }
    private static getCommunityUserIDSearchQuery(): string {
        const query: string = `select count(*) >0 as result from community where post_id = ? and user_uniq_id = ?`;
        return query;
    }
    private static getCommunityReplyUserIDSearchQuery(): string {
        const query: string = `select count(*) >0 as result from community_reply where reply_id = ? and user_uniq_id = ?`;
        return query;
    }
}

export default RightModel;
