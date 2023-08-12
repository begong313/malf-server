import passport from "passport";
import { Strategy } from "passport-local";

import jwtGenerate from "../lib/jwtGenerator";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { searchUserID } from "./lib";

function local() {
    passport.use(
        new Strategy(
            { usernameField: "email", passwordField: "password" },
            async function (email: any, password: any, done: any) {
                try {
                    const rows: RowDataPacket[] = await searchUserID(
                        "local",
                        email
                    );

                    //아이디가 존재하지 않으면
                    if (rows.length == 0) {
                        const errorMessage: string = "등록되지 않은 회원";
                        console.log(errorMessage);
                        return done(null, false, {
                            message: errorMessage,
                        });
                    }

                    const result = await bcrypt.compare(
                        password,
                        rows[0].password
                    );

                    if (result) {
                        const jwtToken = jwtGenerate(rows[0].user_uniq_id);
                        return done(null, jwtToken);
                    }
                    return done(null, false);
                } catch (error) {
                    console.log(error);
                    done(error);
                }
            }
        )
    );
}

export default local;
