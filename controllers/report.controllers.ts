import { Request, Response } from "express";

import Container from "typedi";

export class ReportController {
    // public report = Container.get(ReportModel);
    public reportPost = async (request: Request, response: Response) => {
        const user_uniq_id: string = response.locals.decoded;
        const post_id: string = request.body.post_id;
        const report_info: string = request.body.report_info;
        const report_email: string = request.body.report_email;
    };

    public reportUser = async (request: Request, response: Response) => {
        const user_uniq_id: string = response.locals.decoded;
        const reported_user_uniq_id: string =
            request.body.reported_user_uniq_id;
        const report_info: string = request.body.report_info;
        const report_email: string = request.body.report_email;
    };
    public reportChat = async (request: Request, response: Response) => {
        const user_uniq_id: string = response.locals.decoded;
        const chat_id: string = request.body.chat_id;
        const report_info: string = request.body.report_info;
        const report_email: string = request.body.report_email;
    };
}
