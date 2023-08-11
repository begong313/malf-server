import passport from "passport";
import { Strategy } from "passport-kakao";
import { passportConfig } from "../config/passport_config";

import pool from "../lib/dbConnector";
import jwtGenerate from "../lib/jwtGenerator";
import { QueryError } from "mysql2";

function kakao() {
    passport.use(
        new Strategy(
            passportConfig.kakao,
            async (
                accessToken: any,
                refreshToken: any,
                profile: any,
                done: any
            ) => {
                let user_uniq_id;
                const searchQuery =
                    "select user_uniq_id from kakao_account where kakaoID = ?";
                const values = [profile.id];

                /* 첫 가입인지 확인 후 계정없으면 생성 */
                const [rows]: any = await pool.execute(searchQuery, values);
                if (rows.length == 0) {
                    console.log("Id값이 없읍니다.");
                    user_uniq_id = "k_" + profile.id;
                    const insertAQuery =
                        "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'kakao','12222223456')";
                    const instertBQuery =
                        "insert into kakao_account (user_uniq_id, kakaoID) values (?,?)";
                    await pool.execute(insertAQuery, [user_uniq_id]);
                    await pool.execute(instertBQuery, [
                        user_uniq_id,
                        profile.id,
                    ]);
                    console.log("회원가입성공");
                } else {
                    user_uniq_id = rows[0].user_uniq_id;
                }
                //Jwt생성

                const jwtToken = jwtGenerate(user_uniq_id);
                return done(null, jwtToken);
            }
        )
    );
}

export default kakao;
