import express, { Express } from "express";
import bulletinBoardRouter from "./routes/bulletinBoard";

const port: Number = 8000;
const app: Express = express();

app.use(express.json());
app.use("/bulletin-board", bulletinBoardRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
