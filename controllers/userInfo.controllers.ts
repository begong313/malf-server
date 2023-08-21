import { Request, Response } from "express";

import Container from "typedi";
import { UserInfoModel } from "../models/userInfo.model";

export class UserInfoController {
    public userInfo = Container.get(UserInfoModel);
    public firstSetInfo = async (request: Request, response: Response) => {
        try {
            // 전처리 부분 따로 빼야함.
            const requiredInfo = {
                user_uniq_id: response.locals.decoded,
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
                user_uniq_id: response.locals.decoded,
                description: request.body.description || null,
                able_language: request.body.able_language || null,
                interests: request.body.interests || null,
                profile_pic: JSON.stringify(picDIRList),
            };
            await this.userInfo.setRequiredInfo(requiredInfo);
            await this.userInfo.setAdditionalInfo(additionalInfo);

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
    };
}
