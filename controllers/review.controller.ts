import { NextFunction, Request, Response } from "express";

import Container from "typedi";
import { ReviewModel } from "../models/review.model";
import { HttpException } from "../exeptions/HttpException";

export class ReviewController {
    public userInfo = Container.get(ReviewModel);
    public reviewUser = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const user_uniq_id: string = response.locals.decoded; // review 작성한 사람
            const reviewed_user_uniq_id: string = request.body.user_uniq_id; // review 당한 사람
            const reviewScore: number = request.body.rating;
            if (user_uniq_id == reviewed_user_uniq_id) {
                response.status(400).json({
                    status: 400,
                    message: "자기 자신에게는 리뷰를 남길 수 없습니다.",
                });
                return;
            }

            await this.userInfo.reviewUser(reviewed_user_uniq_id, reviewScore);
            response.status(200).json({
                status: 200,
                message: "리뷰 등록 성공",
            });
        } catch (e) {
            next(new HttpException(400, "리뷰 등록 실패"));
        }
    };
}
