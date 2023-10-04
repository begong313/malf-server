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

        this.router.get(
            "/enter/:id",
            (request: Request, response: Response) => {
                const io = request.app.get("io");
                const { rooms } = io.of("/chat").adapter;
                console.log(rooms);
                return response.render("chat", {});
            }
        );
    }
}
