import express, { Router, Response, Request } from "express";

const router: Router = express.Router();

router.get("/", (request: Request, response: Response) => {
    response.send("sdfsd");
});

export default router;
