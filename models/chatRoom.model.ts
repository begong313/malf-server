import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
import { Service } from "typedi";

@Service()
export class ChatRoomModel {
    //채팅방 참가 신청
    public wantJoinChatRoom = async (
        post_id: string,
        user_uniq_id: string
    ): Promise<void> => {
        const query: string = this.getInsertWantJoinQuery();
        const values: string[] = [post_id, user_uniq_id];
        await pool.execute(query, values);
    };

    //참가신청 취소
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

    //참가 목록 받아오기
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

    public loadChatMembers = async (post_id: string) => {
        try {
            const query: string = this.getLoadChatMemberQuery();
            const values: string[] = [post_id];
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                values
            );
            return rows;
        } catch (err) {
            console.log(err);
        }
    };

    public loadMyChatRooms = async (
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        try {
            const query: string = this.getLoadMyChatRoomsQuery();

            const values: string[] = [user_uniq_id];
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
        const query: string = `select pwj.user_uniq_id as user_uniq_id, uri.user_type as user_type, uri.nation as nation, uri.nickname as nick_name,
        uri.birthday as birthday, uri.default_language as default_language ,uai.profile_pic as profile_pic 
        from post_want_join as pwj join user_require_info as uri on pwj.user_uniq_id = uri.user_uniq_id join user_additional_info as uai on pwj.user_uniq_id = uai.user_uniq_id 
        where post_id = ?`;
        return query;
    }
    private getLoadChatMemberQuery(): string {
        const query: string = `select pp.user_uniq_id as user_uniq_id, uri.user_type as user_type, uri.nation as nation, uri.nickname as nick_name,
        uri.birthday as birthday, uri.default_language as default_language ,uai.profile_pic as profile_pic 
        from post_participation as pp join user_require_info as uri on pp.user_uniq_id = uri.user_uniq_id join user_additional_info as uai on pp.user_uniq_id = uai.user_uniq_id 
        where post_id = ?`;
        return query;
    }
    private getLoadMyChatRoomsQuery(): string {
        const query: string = `select post.post_id, post.picture as picture, post.title as title, (select count(*) from post_participation where post_id = post.post_id) as personnel from post_participation join post on post_participation.post_id = post.post_id where post_participation.user_uniq_id = ?`;
        return query;
    }
}
