import { Service } from "typedi";
import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";

@Service()
export class UserModel {
    public setRequiredInfo = async (requiredInfo: any) => {
        const query: string = this.getSetRequiredInfoQuery();
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
    public updateRequiredInfo = async (update_data: any) => {
        const query: string = this.getUpdateRequiredInfoQuery();
        const values = [
            update_data.user_uniq_id,
            update_data.user_type,
            update_data.nation,
            update_data.gender,
            update_data.nickname,
            update_data.birthday,
            update_data.default_language,
        ];
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

    public updateAdditionalInfo = async (update_data: any) => {
        const query: string = this.getUpdateAdditionalInfoQuery();
        const values = [
            update_data.user_uniq_id,
            update_data.description,
            update_data.able_language,
            update_data.interests,
            update_data.profile_pic,
        ];
        await pool.execute(query, values);
    };

    //회원탈퇴 로직 1 : user_id 테이블에서 삭제
    public deleteUser = async (user_uniq_id: string): Promise<void> => {
        const query: string = this.getDeleteUserQuery();
        await pool.execute(query, [user_uniq_id]);
    };

    //회원탈퇴 로직 2 : user_resigned 테이블에 추가
    public addResignedUser = async (user_uniq_id: string): Promise<void> => {
        const query: string = this.getAddResignedUserQuery();
        await pool.execute(query, [user_uniq_id]);
    };

    public getUserStatus = async (
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getGetUserStatusQuery();
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            [user_uniq_id]
        );
        return rows;
    };

    public getUserProfile = async (
        user_uniq_id: string
    ): Promise<RowDataPacket[]> => {
        const query: string = this.getGetUserProfileQuery();
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query,
            [user_uniq_id]
        );
        return rows;
    };

    public setStudentID = async (user_uniq_id: string, studentID: any) => {
        const query: string = this.getSetStudentIDQuery();
        try {
            const values = [studentID, user_uniq_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    public getLikeList = async (
        user_uniq_id: string,
        page: number,
        limit: number
    ) => {
        const query: string = this.getGetLikeListQuery();
        try {
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                [user_uniq_id, String(limit), String((page - 1) * limit)]
            );
            return rows;
        } catch (err) {
            console.log(err);
        }
    };

    public getWriteList = async (
        user_uniq_id: string,
        page: number,
        limit: number
    ) => {
        const query: string = this.getGetWriteListQuery();
        try {
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                [user_uniq_id, String(limit), String((page - 1) * limit)]
            );
            return rows;
        } catch (err) {
            console.log(err);
        }
    };

    public getApplyList = async (
        user_uniq_id: string,
        page: number,
        limit: number
    ) => {
        const query: string = this.getGetApplyListQuery();
        try {
            const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
                query,
                [user_uniq_id, String(limit), String((page - 1) * limit)]
            );
            return rows;
        } catch (err) {
            console.log(err);
        }
    };

    //user status 변경
    public setUserStatus = async (user_uniq_id: string, status: number) => {
        const query: string = this.getSetUserStatusQuery();
        try {
            const values = [status, user_uniq_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    private getSetRequiredInfoQuery(): string {
        const query: string =
            "insert into user_require_info (user_uniq_id, user_type, nation, gender, nickname, birthday, default_language) values (?,?,?,?,?,?,?)";
        return query;
    }
    private getUpdateRequiredInfoQuery(): string {
        const query: string =
            "update user_require_info set user_type = ?, nation = ?, gender = ?, nickname = ?, birthday= ? where user_uniq_id = ?";
        return query;
    }

    private getSetAdditionalInfoQuery(): string {
        const query: string =
            "insert into user_additional_info (user_uniq_id, description, able_language, interests, profile_pic) values (?,?,?,?,?)";
        return query;
    }

    private getUpdateAdditionalInfoQuery(): string {
        const query: string =
            "update user_additional_info set description = ?, able_language = ?, interests = ?, profile_pic = ? where user_uniq_id = ?";
        return query;
    }

    private getDeleteUserQuery(): string {
        const query: string = "delete from user_id where user_uniq_id = ?";
        return query;
    }

    private getAddResignedUserQuery(): string {
        const query: string =
            "insert into user_resigned (user_uniq_id) values (?)";
        return query;
    }

    private getGetUserStatusQuery(): string {
        const query: string =
            "select status as user_status from user_id where user_uniq_id = ?";
        return query;
    }

    private getGetUserProfileQuery(): string {
        const query: string =
            "select i.user_uniq_id, i.status as user_status, \
            r.user_type, r.nation, r.gender, r.nickname, r.birthday, r.default_language, r.created_at, \
            a.description, a.interests, a.profile_pic, a.updated_at \
            from user_id as i join user_require_info as r on i.user_uniq_id = r.user_uniq_id join user_additional_info as a on i.user_uniq_id = a.user_uniq_id\
            where i.user_uniq_id = ?";
        return query;
    }

    private getGetLikeListQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id, post.category_id as category, 
        (select count(*) from post_like where post_id = post.post_id )as like_count, post.post_status as post_status
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id 
        join post_like on post.post_id = post_like.post_id 
        where post_like.user_uniq_id = ?
        order by post.post_id desc
        Limit ? offset ?
        `;
        return query;
    }

    private getGetWriteListQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id, post.category_id as category,
        (select count(*) from post_like where post_id = post.post_id )as like_count, post.post_status as post_status
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id 
        where post.user_uniq_id = ?
        order by post.post_id desc
        Limit ? offset ? `;
        return query;
    }

    private getGetApplyListQuery(): string {
        const query: string = `select post.post_id, post.title, user_require_info.nickname as author_nickname,
        user_require_info.nation as author_nation, user_require_info.user_type as user_type,
        post.capacity_local as capacity_local, post.capacity_travel as capacity_travel, post.picture as meeting_pic,post.location as meeting_location, 
        post.start_time as meeting_start_time , post.user_uniq_id, post.category_id as category,
        (select count(*) from post_like where post_id = post.post_id )as like_count, post.post_status as post_status
        from user_require_info join post on user_require_info.user_uniq_id = post.user_uniq_id join post_want_join on post.post_id = post_want_join.post_id 
        where post_want_join.user_uniq_id = ?
        order by post.post_id desc
        Limit ? offset ? `;
        return query;
    }

    private getSetStudentIDQuery(): string {
        const query: string =
            "update user_id set  student_id = ?, status = '1'  where user_uniq_id = ? ";
        return query;
    }

    private getSetUserStatusQuery(): string {
        const query: string = `"update user_id set status = ? where user_uniq_id = ?";`;
        return query;
    }
}
