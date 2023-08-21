import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
const dbConnectData: DbConfig = {
    host: process.env.DB_HOST!,
    port: 3306,
    user: process.env.DB_USER!,
    password: process.env.DB_PW!,
    database: process.env.DB_NAME!,
};
export default dbConnectData;
