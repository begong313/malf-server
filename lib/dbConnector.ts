import mysql from "mysql2";
import dbConnectData from "../config/db_config";

const env: string = process.env.NODE_ENV || "development";

var pool: mysql.Pool = mysql.createPool({
    ...dbConnectData,
    namedPlaceholders: true,
    charset: "utf8mb4",
});

pool.getConnection((error, conn) => {
    if (error) {
        console.error("fail to connect", error);
        return;
    }
    console.log(env, "db connect success");
    pool.releaseConnection(conn);
});
const promisepool = pool.promise();

export default promisepool;
