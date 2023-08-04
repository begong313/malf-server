import express, { Express } from "express";
import authRtouer from "./routes/auth";
import passportInit from "./passport";
import userRouter from "./routes/user";
import bulletinboardRouter from "./routes/bulletinBoard";
import chatRouter from "./routes/chatRoom";
import picRouter from "./routes/picture";
import cors from "cors";

const app: Express = express();

app.set("port", process.env.PORT || 8000);

// 회원가입 정책 init
passportInit();

//cors origin error 대비
app.use(cors());

app.use("/favicon.ico", (req, res, next) => {
    // 파비콘 요청에 대해 404 Not Found 응답을 보냅니다.
    res.status(404).end();
});

//Router Setting
app.use("/auth", authRtouer);
app.use("/user", userRouter);
app.use("/bulletin-board", bulletinboardRouter);
app.use("/chatroom", chatRouter);
app.use("/", picRouter);

app.listen(app.get("port"), () => {
    console.log("8000번에서 동작중 ");
});
