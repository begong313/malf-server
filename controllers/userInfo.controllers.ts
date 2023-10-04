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
                nation: request.body.nation,
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
            //todo : additionalinfo가 전체가 다 값이있다면 User_status를 검토중(1)으로
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

    public updateUserInfo = async (request: Request, response: Response) => {
        const user_uniq_id: string = response.locals.decoded;
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
        const update_requiredInfo_data = {
            user_uniq_id: user_uniq_id,
            user_type: request.body.user_type,
            nation: request.body.nation,
            gender: request.body.gender,
            nickname: request.body.nickname,
            birthday: request.body.birthday,
        };
        const update_additionalInfo_data = {
            user_uniq_id: user_uniq_id,
            description: request.body.description || null,
            able_language: request.body.able_language || null,
            interests: request.body.interests || null,
            profile_pic: JSON.stringify(picDIRList),
        };

        await this.userInfo.setRequiredInfo(update_requiredInfo_data);
        await this.userInfo.setAdditionalInfo(update_additionalInfo_data);
        response.status(200).json({
            status: 200,
            message: "회원 정보 수정 성공",
        });
    };

    //회원 탈퇴
    public resignUser = async (request: Request, response: Response) => {
        const user_uniq_id = response.locals.decoded;
        await this.userInfo.deleteUser(user_uniq_id);
        await this.userInfo.addResignedUser(user_uniq_id);

        response.status(200).json({
            status: 200,
            message: "회원 탈퇴 성공",
        });
    };

    public getUserStatus = async (request: Request, response: Response) => {
        const user_uniq_id = response.locals.decoded;
        const rows = await this.userInfo.getUserStatus(user_uniq_id);
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };

    public getUserInfo = async (request: Request, response: Response) => {
        const request_user_id = response.locals.decoded;
        const target_user_id = request.params.id;

        if (request_user_id == target_user_id) {
            //자기 자신의 정보를 가져올 때 , 남의 정보일 때 다르게 해야할듯
            //Todo
        }
        const rows = await this.userInfo.getUserInfo(target_user_id);
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };
}
