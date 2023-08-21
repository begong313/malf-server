import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
import { Service } from "typedi";

@Service()
export class ChatRoomModel {
    public wantJoinChatRoom = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getInsertWantJoinQuery();
        const values: string[] = [post_id, user_uniq_id];
        await pool.execute(query, values);
    };

    public cancelJoinChatRoom = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<ResultSetHeader> => {
        const query: string = this.getDeleteFromWantJoinQuery();
        const values: string[] = [post_id, user_uniq_id];
        const [data]: [ResultSetHeader, FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return data;
    };

    public loadEnterRequestChatRoom = async (
        post_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getLoadEnterRequestQuery();
        const values: string[] = [post_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };

    public agreeEnterChatRoom = async (
        post_id: string,
        applicant_uniq_id: string
    ): Promise<void> => {
        const insertQuery = this.getInserParticipationQuery();
        const deleteQuery = this.getDeleteFromWantJoinQuery();
        const values = [post_id, applicant_uniq_id];
        await Promise.all([
            pool.execute(insertQuery, values),
            pool.execute(deleteQuery, values),
        ]);
    };

    public disagreeEnterChatRoom = async (
        post_id: string,
        applicant_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getDeleteFromWantJoinQuery();
        const values = [post_id, applicant_uniq_id];
        await pool.execute(query, values);
    };

    public leaveChatRoom = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getDeleteFromParticipationQuery();
        const values: string[] = [post_id, user_uniq_id];
        await pool.execute(query, values);
    };

    public loadChatMembers = async (
        post_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getLoadChatMemberQuery();
        const values: string[] = [post_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows;
    };

    private getInsertWantJoinQuery(): string {
        const query: string = `insert into post_want_join (post_id, user_uniq_id) values (?,?)`;
        return query;
    }
    private getInserParticipationQuery(): string {
        const query: string = `insert into post_participation (post_id, user_uniq_id) values (?,?)`;
        return query;
    }
    private getDeleteFromWantJoinQuery(): string {
        const query: string = `delete from post_want_join where post_id = ? and user_uniq_id = ? `;
        return query;
    }
    private getDeleteFromParticipationQuery(): string {
        const query: string = `delete from post_participation where post_id = ? and user_uniq_id = ? `;
        return query;
    }
    private getLoadEnterRequestQuery() {
        const query: string = `select * from post_want_join join user_require_info on post_want_join.user_uniq_id = user_require_info.user_uniq_id where post_id = ?`;
        return query;
    }
    private getLoadChatMemberQuery(): string {
        const query: string = `select * from post_participation join user_require_info on post_participation.user_uniq_id = user_require_info.user_uniq_id where post_id = ?`;
        return query;
    }
}
