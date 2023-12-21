import { FieldPacket, RowDataPacket } from "mysql2";
import RightModel from "../models/right.model";
class RightChecker {
    // 삭제를 두번누르게되면 (그럴일없긴함) 두번째는 글이없어서 권한이 없다고 뜬다.
    public static postRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<boolean> => {
        const rows = await RightModel.postRightCheck(user_uniq_id, post_id);

        if (rows[0].result != 0) {
            return true;
        }
        return false;
    };
    public static communityRightCheck = async (
        user_uniq_id: string,
        post_id: string
    ): Promise<boolean> => {
        const rows = await RightModel.communityRightCheck(
            user_uniq_id,
            post_id
        );

        if (rows[0].result != 0) {
            return true;
        }
        return false;
    };
    public static communityRelpyRightCheck = async (
        user_uniq_id: string,
        reply_id: string
    ): Promise<boolean> => {
        const rows = await RightModel.communityReplyRightCheck(
            user_uniq_id,
            reply_id
        );

        if (rows[0].result != 0) {
            return true;
        }
        return false;
    };

    public static chatRightCheck = async (
        user_uniq_id: string,
        chat_id: string
    ): Promise<boolean> => {
        const rows = await RightModel.chatRightCheck(user_uniq_id, chat_id);

        if (rows[0].result != user_uniq_id) {
            return true;
        }
        return false;
    };
}
export default RightChecker;
