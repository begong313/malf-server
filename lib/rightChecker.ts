import { FieldPacket, RowDataPacket } from "mysql2";
import RightModel from "../models/right.model";
class RightChecker {
    public static postRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<boolean> => {
        const rows = await RightModel.postRightCheck(user_uniq_id, post_id);

        if (rows[0].user_uniq_id == user_uniq_id) {
            return true;
        }
        return false;
    };
}
export default RightChecker;
