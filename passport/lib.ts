import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";

async function searchUserID(
    platform: string,
    profile_ID: string
): Promise<RowDataPacket[]> {
    const values: string[] = [profile_ID];
    const searchQuery: string = `select * from ${platform}_account where ${platform}ID = ?`;
    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
        searchQuery,
        values
    );
    return rows;
}

async function signUP(
    platform: string,
    profile_ID: string,
    password?: string
): Promise<string> {
    let prefix: string;

    switch (platform) {
        case "kakao":
            prefix = "k_";
            break;
        case "google":
            prefix = "g_";
            break;
        case "line":
            prefix = "l_";
            break;
        case "local":
            prefix = "lo_";
            break;
        default:
            prefix = "";
    }

    const user_uniq_id: string = prefix + profile_ID;
    console.log(user_uniq_id);
    //휴대폰 버놓 부분은 따로 분리해야 함
    const insertAQuery = `insert into user_id (user_uniq_id, account_type, phone_number) values (?,?,'12222223456')`;
    await pool.execute(insertAQuery, [user_uniq_id, platform]);

    let insertBQuery;
    let values;
    if (platform == "local") {
        insertBQuery =
            "insert into local_account (user_uniq_id, password,localID) values (?,?,?)";
        values = [user_uniq_id, password, profile_ID];
    } else {
        insertBQuery = `insert into ${platform}_account (user_uniq_id, ${platform}ID) values (?,?)`;
        values = [user_uniq_id, profile_ID];
    }

    await pool.execute(insertBQuery, values);

    return user_uniq_id;
}

/* 
사용자 채크후 user_uniq_id 반환,
상황에따라 로그인 Or 회원가입
*/
async function getUserUniqId(platform: string, ID: string): Promise<string> {
    let user_uniq_id: string;
    const rows: RowDataPacket[] = await searchUserID(platform, ID);
    if (rows.length == 0) {
        console.log("Id값이 없읍니다.");
        user_uniq_id = await signUP(platform, ID);
        console.log("회원가입성공");
    } else {
        user_uniq_id = rows[0].user_uniq_id;
    }
    return user_uniq_id;
}

export { searchUserID, signUP, getUserUniqId };
