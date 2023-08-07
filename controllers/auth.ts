import { Response, Request } from "express";
import pool from "../lib/dbConnector";
import bcrypt from "bcrypt";
import shortid from "shortid";

/* 카카오 요청 응답 받은 후 추후 동작 */
function kakaoCallback(request: Request, response: Response) {
    const jwtToken = request.user;
    response.status(200).json({ status: 200, token: jwtToken });
}

async function localJoin(request: Request, response: Response) {
    console.log(request.body);
    const userEmail = request.body.user_email; // 이거 뭘로할지 정해야됨.
    const password = request.body.password;
    const phone_number = request.body.phone_number;

    const searchQuery =
        "select user_uniq_id from user_id where phone_number = ?";

    const [rows]: any = await pool.execute(searchQuery, [phone_number]);
    if (rows.length != 0) {
        response.status(400).json({
            status: 400,
            message: "이미 등록된 회원입니다.",
        });
        return;
    }
    const user_uniq_id = "lo_" + shortid.generate();

    //이부분이 쫌 오래걸리는듯
    const hashedPWD = await bcrypt.hash(password, 16);
    const insertAQuery =
        "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'local',?)";
    const instertBQuery =
        "insert into local_account (user_uniq_id, password,email) values (?,?,?)";

    await pool.execute(insertAQuery, [user_uniq_id, phone_number]);
    await pool.execute(instertBQuery, [user_uniq_id, hashedPWD, userEmail]);

    response.status(200).json({
        status: 200,
        message: "회원가입 성공",
    });
}
function localLoginCallback(request: Request, response: Response) {
    const jwtToken = request.user;
    response.status(200).json({ status: 200, token: jwtToken });
}

function loginError(request: Request, response: Response) {
    console.log("로그인 실패");
    response.status(400).json({
        status: 400,
        message: "로그인 실패",
    });
}

export { kakaoCallback, localJoin, localLoginCallback, loginError };
