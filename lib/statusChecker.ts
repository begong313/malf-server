import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
class StatusChecker {
    //user status code 반환
    // -1:프로필완성X, 0:정상, 1:검토중 ,2:탈퇴, 3:정지 100: superUser
    public static getStatus = async (user_uniq_id: string): Promise<number> => {
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            `Select status from user_id where user_uniq_id = ?`,
            [user_uniq_id]
        );

        return rows[0].status;
    };

    public static checkStatus(status: number) {}
}
export default StatusChecker;
