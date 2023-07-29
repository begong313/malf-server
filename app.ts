import express, { Express, Request, Response } from "express";
import pool from "./lib/dbConnector";
import authRtouer from "./routes/auth";
const app: Express = express();
app.set("port", process.env.PORT || 8000);

app.use("/auth", authRtouer);

app.get("/", (request: Request, response: Response) => {
    pool.query(`select * from user_id`, function (error, result) {
        console.log(result);
        response.json(result);
    });
});

app.get("/a", (request: Request, response: Response) => {
    response.send("aaa");
});

app.listen(app.get("port"), () => {
    console.log("8000번에서 동작중 ");
});
