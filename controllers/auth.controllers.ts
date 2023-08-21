import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import shortid from "shortid";
import axios from "axios";
import jwtGenerate from "../lib/jwtGenerator";
import { getUserUniqId, searchUserID, signUP } from "../passport/lib";
import { RowDataPacket } from "mysql2";
import { HttpException } from "../exeptions/HttpException";
import { oauthConfig } from "../config/oauth_config";
import serverConfig from "../config/server_config";

/* 라인 소셜로그인 Redirect url*/
export class AuthController {
    public lineUrl: string = "https://access.line.me";

    public lineRedirect = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const client_id: string = oauthConfig.line.clientID;
        const server_url: string = serverConfig.serverURL;
        const state: string = shortid.generate();
        const lineAuthURL: string = `${this.lineUrl}/oauth2/v2.1/authorize?response_type=code&client_id=${client_id}&redirect_uri=${server_url}/auth/line/callback&state=${state}&scope=profile%20openid%20email`;
        response.redirect(lineAuthURL);
    };

    public lineCallback = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        if (request.query.error) {
            console.log(request.query.error);
            response.redirect("auth/login-error");
            return;
        }

        // const state: string = request.query.state as string;
        const code: string = request.query.code as string;
        const server_url: string = serverConfig.serverURL;

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
        const tokenRequestUrl = `${this.lineUrl}/oauth2/v2.1/token`;

        const apiresponse = await axios.post(tokenRequestUrl, dataTosend, {
            headers,
        });

        //받아온 acess token으로 사용자 정보 요청
        //@ts-ignore
        var headers = {
            authorization: `Bearer ${apiresponse.data.access_token}`,
        };
        const userdata = await axios.get(`${this.lineUrl}/v2/profile`, {
            headers,
        });

        const user_uniq_id: string = await getUserUniqId(
            "line",
            userdata.data.userId
        );

        //Jwt생성
        const jwtToken = jwtGenerate(user_uniq_id);
        response.status(200).json({ status: 200, token: jwtToken });
    };

    /*로컬 회원가입 */
    public localJoin = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        console.log(request.body);
        const userEmail = request.body.email; // 로그인 시 Id 로 쓸 이메일, 중복체크 해야함
        const password = request.body.password;

        // const phone_number = request.body.phone_number;

        //이메일이 이미 있으면
        const rows: RowDataPacket[] = await searchUserID("local", userEmail);
        if (rows.length != 0) {
            next(new HttpException(400, "이미 등록된 이메일 입니다."));
            return;
        }

        try {
            //이부분이 쫌 오래걸리는듯
            const hashedPWD = await bcrypt.hash(password, 16);
            await signUP("local", userEmail, hashedPWD);
        } catch (err) {
            next(new HttpException(400, "회원가입중 오류발생"));
            return;
        }

        response.status(200).json({
            status: 200,
            message: "회원가입 성공",
        });
    };
    // 로그인 성공하면 토큰발급
    public loginCallback = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const jwtToken = request.user;
        console.log(jwtToken);
        response.status(200).json({ status: 200, token: jwtToken });
    };

    public loginError = (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        if (request.query.error) {
            next(new HttpException(400, "로그인 실패, " + request.query.error));
            return;
        }
        next(new HttpException(400, "로그인 실패 "));
    };

    public tokenPublish = (request: Request, response: Response) => {
        const user_uniq_id = response.locals.decoded;
        const jwtToken = jwtGenerate(user_uniq_id);
        response.status(200).json({ status: 200, token: jwtToken });
    };
}
