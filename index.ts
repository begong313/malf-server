import express, { Express } from "express";
import bulletinBoardRouter from "./routes/bulletinBoard";
import pictureRouter from "./routes/picture";

const port: Number = 8000;
const app: Express = express();

app.use(express.json());

//개시판
app.use("/bulletin-board", bulletinBoardRouter);
//사진loading
app.use("/", pictureRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
