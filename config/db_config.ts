import dotenv from "dotenv";

dotenv.config();

interface DbConfig {
    [key: string]: {
        host: string | undefined;
        port: number;
        user: string;
        password: string | undefined;
        database: string | undefined;
    };
}
const dbConnectData: DbConfig = {
    development: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: process.env.LOCAL_MYSQL_PW,
        database: "malf_testDB",
    },
    test: {
        host: process.env.MALF_DB_HOST,
        port: 3306,
        user: "dbmasteruser",
        password: process.env.LIVE_MYSQL_PW,
        database: "malf_testDB",
    },
    production: {
        host: process.env.MALF_DB_HOST,
        port: 3306,
        user: "dbmasteruser",
        password: process.env.LIVE_MYSQL_PW,
        database: "malf_testDB",
    },
};
export default dbConnectData;
