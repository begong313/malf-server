import { Request, Response } from "express";
import pool from "../lib/dbConnector";

async function firstSetInfo(request: Request, response: Response) {
    if (request.headers.authorization == undefined) {
        response.status(400).json({
            status: 400,
            message: "사용자 정보가 없습니다",
        });
        return;
    }
    try {
        const requiredInfo = {
            user_type: request.body.user_type,
            nation: request.body.country,
            gender: request.body.gender,
            nickname: request.body.nickname,
            birthday: request.body.birthday,
            default_language: request.body.default_language,
        };

        const imageFiles: any = request.files;
        var picDIRList: string[] = []; //사진 경로 담을 array
        //첨부사진이 없을 때
        if (imageFiles.length == 0) {
            picDIRList.push("default.jpeg");
        } else {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].filename);
            }
        }
        const additionalInfo = {
            description: request.body.description || null,
            able_language: request.body.able_language || null,
            interests: request.body.interests || null,
            profile_pic: JSON.stringify(picDIRList),
        };

        const requiredInfoQuery: string =
            "insert into user_require_info (user_uniq_id, user_type, nation, gender, nick_name, birthday, default_language) values (?,?,?,?,?,?,?)";
        const requiredValues = [
            request.headers.authorization,
            requiredInfo.user_type,
            requiredInfo.nation,
            requiredInfo.gender,
            requiredInfo.nickname,
            requiredInfo.birthday,
            requiredInfo.default_language,
        ];
        const additionalInfoQuery: string =
            "insert into user_additional_info (user_uniq_id, description, able_language, interests, profile_pic) values (?,?,?,?,?)";
        const additionalValues = [
            request.headers.authorization,
            additionalInfo.description,
            additionalInfo.able_language,
            additionalInfo.interests,
            additionalInfo.profile_pic,
        ];
        await pool.execute(
            "delete from user_require_info where user_uniq_id = ?",
            [request.headers.authorization]
        );
        await pool.execute(
            "delete from user_additional_info where user_uniq_id = ?",
            [request.headers.authorization]
        );
        await pool.execute(requiredInfoQuery, requiredValues);
        await pool.execute(additionalInfoQuery, additionalValues);

        response.status(200).json({
            status: 200,
            message: "회원 정보 등록 성공",
            requireInfo: requiredInfo,
            additionalInfo: additionalInfo,
        });
    } catch (err) {
        console.log(err);
        response.status(400).json({
            status: 400,
            message: "회원정보 등록 실패",
        });
    }
}
export { firstSetInfo };
