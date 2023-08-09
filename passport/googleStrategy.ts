import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { passportConfig } from "../config/passport_config";
import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
import jwtGenerate from "../lib/jwtGenerator";

function google() {
    passport.use(
        new Strategy(
            passportConfig.google,
            async (accessToken, refreshToken, profile, cb) => {
                let user_uniq_id: string;
                const searchQuery =
                    "select user_uniq_id from google_account where googleID = ?";
                const values = [profile.id];
                const [rows]: [RowDataPacket[], FieldPacket[]] =
                    await pool.execute(searchQuery, values);

                if (rows.length == 0) {
                    console.log("Id값이 없읍니다.");
                    user_uniq_id = "g_" + profile.id;
                    console.log(user_uniq_id);
                    const insertAQuery =
                        "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'google','1234356')";
                    const instertBQuery =
                        "insert into google_account (user_uniq_id, googleID) values (?,?)";
                    await pool.execute(insertAQuery, [user_uniq_id]);
                    await pool.execute(instertBQuery, [
                        user_uniq_id,
                        profile.id,
                    ]);
                    console.log("회원가입성공");
                } else {
                    user_uniq_id = rows[0].user_uniq_id;
                }
                const jwtToken = jwtGenerate(user_uniq_id);
                return cb(null, jwtToken);
            }
        )
    );
}

export default google;
