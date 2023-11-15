import { NextFunction, Request, Response } from "express";

import Container from "typedi";
import { UserModel } from "../models/user.model";

export class UserController {
    public userInfo = Container.get(UserModel);
    public firstSetProfile = async (request: Request, response: Response) => {
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

            if (imageFiles == undefined || imageFiles.length == 0) {
                picDIRList.push(
                    "https://malf-live.s3.ap-northeast-2.amazonaws.com/default.png"
                );
            } else {
                //사진 dir정보
                for (var i = 0; i < imageFiles.length; i++) {
                    picDIRList.push(imageFiles[i].location);
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

    public updateUserProfile = async (request: Request, response: Response) => {
        const user_uniq_id: string = response.locals.decoded;
        const imageFiles: any = request.files;
        var picDIRList: string[] = []; //사진 경로 담을 array
        //첨부사진이 없을 때
        if (imageFiles == undefined || imageFiles.length == 0) {
            picDIRList.push(
                "https://malf-live.s3.ap-northeast-2.amazonaws.com/default.png"
            );
        } else {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].location);
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

    //todo : 현재 추가정보 입력이 안되면 아얘 값이 안보이게 쿼리가 짜여져있음
    public getUserProfile = async (request: Request, response: Response) => {
        const request_user_id = response.locals.decoded;
        const target_user_id = request.params.id;
        console.log("search id", target_user_id);
        if (request_user_id == target_user_id) {
            //Todo : 자기 자신의 정보를 가져올 때 , 남의 정보일 때 다르게 해야할듯
        }
        const rows = await this.userInfo.getUserProfile(target_user_id);
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };

    public setStudentID = async (request: Request, response: Response) => {
        const imageFiles: any = request.files;
        const user_uniq_id: string = response.locals.decoded;
        var picDIRList: string[] = []; //사진 경로 담을 array
        //첨부사진이 없을 때
        if (
            imageFiles == null ||
            imageFiles == undefined ||
            imageFiles.length == 0
        ) {
            response.status(400).json({
                status: 400,
                message: "사진이 없습니다.",
            });
        } else {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].location);
            }
        }

        await this.userInfo.setStudentID(
            user_uniq_id,
            JSON.stringify(picDIRList)
        );
        await this.userInfo.setUserStatus(user_uniq_id, 0);

        response.status(200).json({
            status: 200,
            message: "학생증 등록 성공",
        });
    };

    public getLikeList = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = request.params.id;
        const page: number = Number(request.query.page) || 1;
        const limit: number = Number(request.query.limit) || 100;
        const rows = await this.userInfo.getLikeList(user_uniq_id, page, limit);
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };

    public getWriteList = async (request: Request, response: Response) => {
        const user_uniq_id = request.params.id;
        const page: number = Number(request.query.page) || 1;
        const limit: number = Number(request.query.limit) || 100;
        const rows = await this.userInfo.getWriteList(
            user_uniq_id,
            page,
            limit
        );
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };

    public getApplyList = async (request: Request, response: Response) => {
        const user_uniq_id = request.params.id;
        const page: number = Number(request.query.page) || 1;
        const limit: number = Number(request.query.limit) || 100;
        const rows = await this.userInfo.getApplyList(
            user_uniq_id,
            page,
            limit
        );
        response.status(200).json({
            status: 200,
            data: rows,
        });
    };
}
