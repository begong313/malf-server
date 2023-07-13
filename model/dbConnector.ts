/* db Connector */

import mysql from "mysql";
import dotenv, { DotenvConfigOutput } from "dotenv";
import path from "path";

const result: DotenvConfigOutput = dotenv.config({
    path: path.join(__dirname, "../..", ".env"),
});
if (result.parsed === undefined) {
    throw new Error("Can't load env file!");
} else {
    console.log("Load env file complete");
}

var pool: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DB_NAME,
});

pool.getConnection((error) => {
    if (error) {
        console.error("fail to connect", error);
        return;
    }
    console.log("db connect success");
});

export default pool;
