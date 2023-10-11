import express, { Request, Response } from "express";
import { Routes } from "../interfaces/routes.interface";

export class TestRoute implements Routes {
    public path = "/test";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`/chatTest`, (request, response) => {
            try {
                response.render("index1");
            } catch (err) {
                console.log(err);
                response.send("sss");
            }
        });

        this.router.get(
            "/enter/:id",
            (request: Request, response: Response) => {
                const io = request.app.get("io");
                const { rooms } = io.of("/chat").adapter;
                console.log(rooms);
                return response.render("chat", {});
            }
        );
        this.router.get("/chat", async (request, response) => {
            const io = request.app.get("io").of("/chat");

            io.to("1").emit("chat", {
                user: "test1",
                chat: "sdfsdfs",
                date: Date.now(),
            });

            return response.send("Sdfs");
        });

        this.router.get("/mdb", async (request, response) => {
            const io = request.app.get("io").of("/chat");

            io.to("23").emit("chat", {
                user: "test11",
                chat: "sdfsdfs",
                date: Date.now(),
            });

            return response.send("Sdfs");
        });
    }
}
