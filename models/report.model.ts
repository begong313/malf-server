import { Service } from "typedi";
import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";

@Service()
export class ReportModel {
    public reportPost = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportPostQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    public reportUser = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportUserQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    public reportChat = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportChatQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    public reportCommunity = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportCommunityQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    public reportCommunityReply = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportCommunityReplyQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    public reportCommunityReReply = async (report_data: any): Promise<void> => {
        try {
            const query: string = this.getReportCommunityReReplyQuery();
            const values = [
                report_data.user_uniq_id,
                report_data.reported_id,
                report_data.report_info,
                report_data.report_email,
            ];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };

    //////////////////////// 쿼리문 ////////////////////////
    private getReportPostQuery = (): string => {
        const query: string =
            "insert into post_report (user_uniq_id, post_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
    private getReportUserQuery = (): string => {
        const query: string =
            "insert into user_report (user_uniq_id, reported_user_uniq_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
    private getReportChatQuery = (): string => {
        const query: string =
            "insert into chat_report (user_uniq_id, chat_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
    private getReportCommunityQuery = (): string => {
        const query: string =
            "insert into community_report (user_uniq_id, post_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
    private getReportCommunityReplyQuery = (): string => {
        const query: string =
            "insert into community_reply_report (user_uniq_id, reply_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
    private getReportCommunityReReplyQuery = (): string => {
        const query: string =
            "insert into community_re_reply_report (user_uniq_id, re_reply_id, report_info, report_email) values (?, ?, ?, ?)";
        return query;
    };
}
