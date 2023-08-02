import express, { Express } from "express";
import authRtouer from "./routes/auth";
import passportInit from "./passport";
import userRouter from "./routes/user";
import bulletinboardRouter from "./routes/bulletinBoard";
import chatRouter from "./routes/chatRoom";
import cors from "cors";
const app: Express = express();

app.set("port", process.env.PORT || 8000);

// 회원가입 정책 init
passportInit();

//cors origin error 대비
app.use(cors());

//Router Setting
app.use("/auth", authRtouer);
app.use("/user", userRouter);
app.use("/bulletin-board", bulletinboardRouter);
app.use("/chatroom", chatRouter);

app.listen(app.get("port"), () => {
    console.log("8000번에서 동작중 ");
});
