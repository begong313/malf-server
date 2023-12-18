import { Request, Response } from "express";

import Container from "typedi";
import { ReportModel } from "../models/report.model";

export class ReportController {
    public report = Container.get(ReportModel);
    public reportPost = async (request: Request, response: Response) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.post_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };
        await this.report.reportPost(report_data);
        response.status(200).json({
            status: 200,
            message: "post report success",
        });
    };

    public reportUser = async (request: Request, response: Response) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.user_uniq_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };

        await this.report.reportUser(report_data);
        response.status(200).json({
            status: 200,
            message: "user report success",
        });
    };
    public reportChat = async (request: Request, response: Response) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.chat_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };
        await this.report.reportChat(report_data);
        response.status(200).json({
            status: 200,
            message: "chat report success",
        });
    };

    public reportCommunity = async (request: Request, response: Response) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.post_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };
        await this.report.reportCommunity(report_data);
        response.status(200).json({
            status: 200,
            message: "community report success",
        });
    };
    public reportCommunityReply = async (
        request: Request,
        response: Response
    ) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.reply_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };
        await this.report.reportCommunityReply(report_data);
        response.status(200).json({
            status: 200,
            message: "community reply report success",
        });
    };
    public reportCommunityReReply = async (
        request: Request,
        response: Response
    ) => {
        const report_data = {
            user_uniq_id: response.locals.decoded,
            reported_id: request.body.re_reply_id,
            report_info: request.body.report_info,
            report_email: request.body.report_email,
        };
        await this.report.reportCommunityReReply(report_data);
        response.status(200).json({
            status: 200,
            message: "community rereply report success",
        });
    };
}
