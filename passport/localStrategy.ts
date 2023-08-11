import passport from "passport";
import { Strategy } from "passport-local";

import pool from "../lib/dbConnector";
import jwtGenerate from "../lib/jwtGenerator";
import bcrypt from "bcrypt";

function local() {
    passport.use(
        new Strategy(
            { usernameField: "email", passwordField: "password" },
            async function (email: any, password: any, done: any) {
                try {
                    const searchQuery =
                        "select user_uniq_id, password from local_account where email = ?";
                    const values = [email];
                    const [rows]: any = await pool.execute(searchQuery, values);
                    if (rows.length == 0) {
                        console.log("등록되지 않은 회원");
                        return done(null, false);
                    }
                    const result = await bcrypt.compare(
                        password,
                        rows[0].password
                    );
                    if (result) {
                        const jwtToken = jwtGenerate(rows[0].user_uniq_id);
                        return done(null, jwtToken);
                    }
                } catch (error) {
                    console.log(error);
                    done(error);
                }
            }
        )
    );
}

export default local;
