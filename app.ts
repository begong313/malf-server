import express, { Express, Request, Response, response } from "express";
import pool from "./lib/dbConnector";
import authRtouer from "./routes/auth";
import passportConfig from "./passport";
import session from "express-session";
var FileStore = require("session-file-store")(session);

const app: Express = express();

app.set("port", process.env.PORT || 8000);
app.use(
    session({
        secret: "asadlfkj!@#!@#dfgasdg",
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
    })
);

passportConfig();

app.use("/auth", authRtouer);

app.get("/", (request: Request, response: Response) => {
    pool.query(`select * from user_id`, function (error, result) {
        console.log(result);
        response.json(result);
    });
});
app.get("/success", (request: Request, response: Response) => {
    response.send("success");
});
app.listen(app.get("port"), () => {
    console.log("8000번에서 동작중 ");
});
