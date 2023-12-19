import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../lib/dbConnector";
import { Service } from "typedi";

@Service()
export class BannerModel {
    public getTopBanner = async () => {
        const query = this.getTopBannerQuery();
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.execute(
            query
        );
        return rows;
    };
    private getTopBannerQuery = () => {
        const query = `select picture from banner where type = 1 and active = 1 order by showorder asc`;
        return query;
    };
}
