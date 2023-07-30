import express, { Router, Response, Request } from "express";
import passport from "passport";

const router: Router = express.Router();

router.get("/", (request: Request, response: Response) => {
    response.send("sdfsd");
});

router.get("/kakao", passport.authenticate("kakao"));

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    (request: Request, response: Response) => {
        response.redirect("/success");
    }
);

router.get("/google");
router.get("/line");

export default router;
