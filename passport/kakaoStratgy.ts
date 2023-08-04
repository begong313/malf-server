import passport from "passport";
import { Strategy } from "passport-kakao";
import { passportConfig } from "../config/passport_config";
import jwt from "jsonwebtoken";

import pool from "../lib/dbConnector";
import jwtGenerate from "../lib/jwtGenerator";

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
                console.log(profile);
                console.log("access", accessToken);
                console.log("refreshToken", refreshToken);

                /* 첫 가입인지 확인 후 계정없으면 생성 */
                //todo 리팩토링
                pool.query(
                    `select user_uniq_id from kakao_account where kakaoID = ${profile.id}`,
                    (err, results: any) => {
                        if (err) {
                            console.log("에러가 났습니다.");
                        }
                        if (results.length == 0) {
                            console.log("Id값이 없읍니다.");
                            pool.query(
                                `insert into user_id (user_uniq_id, account_type, phone_number) values ("k_${profile.id}","kakao","123456")`
                            );
                            pool.query(
                                `insert into kakao_account (user_uniq_id, kakaoID) values ("k_${profile.id}","${profile.id}")`
                            );
                            console.log("회원가입성공");
                            return;
                        }
                        console.log(
                            "이미 등록된 회원",
                            results[0].user_uniq_id
                        );
                        const jwtToken = jwtGenerate(results[0].user_uniq_id);

                        //Jwt생성
                        done(null, jwtToken);
                    }
                );
            }
        )
    );
}

export default kakao;
