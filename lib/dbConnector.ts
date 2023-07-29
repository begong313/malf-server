import mysql from "mysql2";
import dbConnectData from "../config/config";

const env: string = process.env.NODE_ENV || "development";

var pool: mysql.Pool = mysql.createPool(dbConnectData[env]);

pool.getConnection((error) => {
    if (error) {
        console.error("fail to connect", error);
        return;
    }
    console.log("db connect success");
});

export default pool;
