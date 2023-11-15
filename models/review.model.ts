import { Service } from "typedi";
import pool from "../lib/dbConnector";

@Service()
export class ReviewModel {
    public reviewUser = async (user_uniq_id: string, reviewScore: any) => {
        try {
            const query: string = this.getReviewUserQuery();
            const values = [reviewScore, user_uniq_id];
            await pool.execute(query, values);
        } catch (err) {
            console.log(err);
        }
    };
    private getReviewUserQuery = (): string => {
        const query: string = `update user_id set user_temperature = user_temperature + ? where user_uniq_id = ?`;
        return query;
    };
}
