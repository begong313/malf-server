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
        this.router.get("/chat", (request, response) => {
            const io = request.app.get("io");
            io.to(1).emit("chat", { date: Date.now() });
            return response.send("Sdfs");
        });
    }
}
