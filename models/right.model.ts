import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";

class RightModel {
    public static postRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<RowDataPacket> => {
        const query: string = this.getUserIDSearchQuery();
        const values = [post_id];
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            values
        );
        return rows[0];
    };

    private static getUserIDSearchQuery(): string {
        const query: string = "select user_uniq_id from post where post_id = ?";
        return query;
    }
}

export default RightModel;
