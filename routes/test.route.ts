import express, { response } from "express";
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
                response.render("index");
            } catch (err) {
                console.log(err);
                response.send("sss");
            }
        });
    }
}
