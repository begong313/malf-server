// import passport from "passport";
// //@ts-ignore
// import { Strategy } from "passport-line-auth";
// import { passportConfig } from "../config/passport_config";
// import { FieldPacket, RowDataPacket } from "mysql2";
// import pool from "../lib/dbConnector";
// import jwtGenerate from "../lib/jwtGenerator";

// function line() {
//     passport.use(
//         new Strategy(
//             passportConfig.line,
//             //@ts-ignore
//             async (accessToken, refreshToken, profile, cb) => {
//                 let user_uniq_id: string;
//                 console.log(profile);
//                 const searchQuery =
//                     "select user_uniq_id from line_account where lineID = ?";
//                 const values = [profile.id];
//                 const [rows]: [RowDataPacket[], FieldPacket[]] =
//                     await pool.execute(searchQuery, values);

//                 if (rows.length == 0) {
//                     console.log("Id값이 없읍니다.");
//                     user_uniq_id = "l_" + profile.id;
//                     console.log(user_uniq_id);
//                     const insertAQuery =
//                         "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'line','12234356')";
//                     const instertBQuery =
//                         "insert into line_account (user_uniq_id, lineID) values (?,?)";
//                     await pool.execute(insertAQuery, [user_uniq_id]);
//                     await pool.execute(instertBQuery, [
//                         user_uniq_id,
//                         profile.id,
//                     ]);
//                     console.log("회원가입성공");
//                 } else {
//                     user_uniq_id = rows[0].user_uniq_id;
//                 }
//                 const jwtToken = jwtGenerate(user_uniq_id);
//                 return cb(null, jwtToken);
//             }
//         )
//     );
// }

// export default line;
