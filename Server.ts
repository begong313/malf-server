import "reflect-metadata";
import express from "express";
import passportInit from "./passport";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { Routes } from "./interfaces/routes.interface";

export class Server {
    app: express.Application;
    env: string;
    port: string;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || "development";
        this.port = process.env.PORT || "8000";

        this.init();
        this.useMiddleWares();
        this.initializeRoutes(routes);

        // 순서가 중요하다. error처리는 마지막에 넣어야함
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(this.port, "에서 동작중");
            console.log(`env : ${this.env}`);
        });
    }

    private init(): void {
        this.app.set("port", this.port);
    }

    private useMiddleWares(): void {
        //cors origin error 대비
        this.app.use(cors());
        this.app.use(express.json());

        passportInit();
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware);
    }
}
