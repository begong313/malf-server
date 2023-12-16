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

    ///////////////////////query/////////////////////////
    private getCreatePostQuery = (): string => {
        const query: string =
            "insert into community (user_uniq_id, title, content, picture) values (?, ?, ?, ?)";
        return query;
    };
}
