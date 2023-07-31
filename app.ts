import express, { Express } from "express";
import authRtouer from "./routes/auth";
import passportInit from "./passport";
import userRouter from "./routes/user";
const app: Express = express();

app.set("port", process.env.PORT || 8000);

passportInit();

app.use("/auth", authRtouer);
app.use("/user", userRouter);

app.listen(app.get("port"), () => {
    console.log("8000번에서 동작중 ");
});
