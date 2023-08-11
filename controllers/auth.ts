import { Response, Request } from "express";
import pool from "../lib/dbConnector";
import bcrypt from "bcrypt";
import shortid from "shortid";
import axios from "axios";
import jwtGenerate from "../lib/jwtGenerator";

/* 카카오 요청 응답 받은 후 추후 동작 */
function kakaoCallback(request: Request, response: Response) {
    const jwtToken = request.user;
    response.status(200).json({ status: 200, token: jwtToken });
}

function googleCallback(request: Request, response: Response) {
    const jwtToken = request.user;
    response.status(200).json({ status: 200, token: jwtToken });
}

function lineRedirect(request: Request, response: Response) {
    const client_id: string = process.env.LINE_ID!;
    let server_url: string = "http://localhost:8000/";
    if (process.env.NODE_ENV) {
        //나중에 test일때도 추가해야함
        server_url = process.env.MALF_SERVER_URL!;
    }
    const state: string = shortid.generate();
    const lineAuthURL: string = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${server_url}auth/line/callback&state=${state}&scope=profile%20openid%20email`;
    response.redirect(lineAuthURL);
}

async function lineCallback(request: Request, response: Response) {
    if (request.query.error) {
        console.log(request.query.error);
        response.redirect("auth/login-error");
        return;
    }
    // const state: string = request.query.state as string;
    const code: string = request.query.code as string;
    let server_url: string = "http://localhost:8000";
    if (process.env.NODE_ENV) {
        //나중에 test일때도 추가해야함
        server_url = process.env.MALF_SERVER_URL!;
    }

    // access token 받아오기
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const dataTosend = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${server_url}/auth/line/callback`,
        client_id: process.env.LINE_ID,
        client_secret: process.env.LINE_SECRET,
    };
    const tokenRequestUrl = "https://api.line.me/oauth2/v2.1/token";
    const apiresponse = await axios.post(tokenRequestUrl, dataTosend, {
        headers,
    });

    //받아온 acess token으로 사용자 정보 요청
    //@ts-ignore
    var headers = {
        authorization: `Bearer ${apiresponse.data.access_token}`,
    };
    const userdata = await axios.get("https://api.line.me/v2/profile", {
        headers,
    });
    console.log(userdata.data);
    console.log([...userdata.data.userId].length);

    //로그인 , 회원가입 프로세스
    let user_uniq_id;
    const searchQuery =
        "select user_uniq_id from line_account where lineID = ?";
    const values = [userdata.data.userId];

    /* 첫 가입인지 확인 후 계정없으면 생성 */
    const [rows]: any = await pool.execute(searchQuery, values);
    if (rows.length == 0) {
        console.log("Id값이 없읍니다.");
        user_uniq_id = "L_" + userdata.data.userId;
        const insertAQuery =
            "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'kakao','12222223456')";
        const instertBQuery =
            "insert into line_account (user_uniq_id, lineID) values (?,?)";
        await pool.execute(insertAQuery, [user_uniq_id]);
        await pool.execute(instertBQuery, [user_uniq_id, userdata.data.userId]);
        console.log("회원가입성공");
    } else {
        user_uniq_id = rows[0].user_uniq_id;
    }
    //Jwt생성
    const jwtToken = jwtGenerate(user_uniq_id);
    response.status(200).json({ status: 200, token: jwtToken });
}

/*로컬 회원가입 */
async function localJoin(request: Request, response: Response) {
    console.log(request.body);
    const userEmail = request.body.email; // 로그인 시 Id 로 쓸 이메일, 중복체크 해야함
    const password = request.body.password;
    const phone_number = request.body.phone_number;

    const searchQuery =
        "select user_uniq_id from local_account where email = ?";

    //이메일이 이미 있으면
    const [rows]: any = await pool.execute(searchQuery, [userEmail]);
    if (rows.length != 0) {
        response.status(400).json({
            status: 400,
            message: "이미 등록된 이메일 입니다.",
        });
        return;
    }
    const user_uniq_id = "lo_" + userEmail();

    //이부분이 쫌 오래걸리는듯
    try {
        const hashedPWD = await bcrypt.hash(password, 16);
        const insertAQuery =
            "insert into user_id (user_uniq_id, account_type, phone_number) values (?,'local',?)";
        const instertBQuery =
            "insert into local_account (user_uniq_id, password,email) values (?,?,?)";

        await pool.execute(insertAQuery, [user_uniq_id, phone_number]);
        await pool.execute(instertBQuery, [user_uniq_id, hashedPWD, userEmail]);
    } catch (err) {
        console.log(err);
        response.status(200).json({
            status: 400,
            message: "회원가입 중 오류발생",
        });
        return;
    }

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

export {
    kakaoCallback,
    googleCallback,
    localJoin,
    localLoginCallback,
    loginError,
    lineRedirect,
    lineCallback,
};
