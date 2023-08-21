import { Service } from "typedi";
import pool from "../lib/dbConnector";

@Service()
export class UserInfoModel {
    public setRequiredInfo = async (requiredInfo: any) => {
        const query: string = this.getSetInsertRequiredInfoQuery();
        const values = [
            requiredInfo.user_uniq_id,
            requiredInfo.user_type,
            requiredInfo.nation,
            requiredInfo.gender,
            requiredInfo.nickname,
            requiredInfo.birthday,
            requiredInfo.default_language,
        ];

        //test를 위해서 일단 삭제, update시에도 활용될 수 있음.
        await pool.execute(
            "delete from user_require_info where user_uniq_id = ?",
            [requiredInfo.user_uniq_id]
        );
        //
        await pool.execute(query, values);
    };

    public setAdditionalInfo = async (additionalInfo: any) => {
        const query: string = this.getSetAdditionalInfoQuery();
        const values = [
            additionalInfo.user_uniq_id,
            additionalInfo.description,
            additionalInfo.able_language,
            additionalInfo.interests,
            additionalInfo.profile_pic,
        ];
        //test를 위해서 일단 삭제, update시에도 활용될 수 있음.
        await pool.execute(
            "delete from user_additional_info where user_uniq_id = ?",
            [additionalInfo.user_uniq_id]
        );
        await pool.execute(query, values);
    };

    private getSetInsertRequiredInfoQuery(): string {
        const query: string =
            "insert into user_require_info (user_uniq_id, user_type, nation, gender, nick_name, birthday, default_language) values (?,?,?,?,?,?,?)";
        return query;
    }
    private getSetAdditionalInfoQuery(): string {
        const query: string =
            "insert into user_additional_info (user_uniq_id, description, able_language, interests, profile_pic) values (?,?,?,?,?)";
        return query;
    }
}
