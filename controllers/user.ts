import { Request, Response } from "express";

function firstSetInfo(request: Request, response: Response) {
    const requiredInfo = {
        user_type: request.body.user_type,
        gender: request.body.gender,
        nickname: request.body.nickname,
        birthday: request.body.birthday,
        default_language: request.body.default_language,
        country: request.body.country,
    };

    const additionalInfo = {
        description: request.body.description,
        able_language: request.body.able_language,
        interests: request.body.interests,
        profile_pic: request.file,
    };
    response.send("asdf");
}

export { firstSetInfo };
