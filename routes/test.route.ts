import express, { Request, Response } from "express";
import { Routes } from "../interfaces/routes.interface";
import pool from "../lib/dbConnector";
import { FieldPacket, RowDataPacket } from "mysql2";

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
        this.router.get("/", async (request: Request, response: Response) => {
            try {
                const [rooms]: [RowDataPacket[], FieldPacket[]] =
                    await pool.execute(
                        "SELECT title as title, user_uniq_id as owner, capacity_local as max  FROM post"
                    );
                console.log(rooms);
                response.render("main", { rooms });
            } catch (err) {
                console.log(err);
                response.send("error");
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
        this.router.get("/chat/:id", async (request, response) => {
            const io = request.app.get("io").of("/chat");
            const room = request.params.id;
            io.to(room).emit("chat", {
                user: "test1",
                chat: "sdfsdfs",
                date: Date.now(),
            });

            return response.send("Sdfs");
        });

        this.router.get("/mdb/:id", async (request, response) => {
            const io = request.app.get("io").of("/chat");
            const room = request.params.id;
            io.to(room).emit("test", {
                user: "test11",
                chat: "sdfsdfs",
                date: Date.now(),
            });

            return response.send("Sdfs");
        });
    }
}
