import express, { Router, Response, Request } from "express";
import passport from "passport";

const router: Router = express.Router();

router.get("/kakao", passport.authenticate("kakao"));

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        session: false,
        failureRedirect: "/",
    }),
    (request: Request, response: Response) => {
        const jwtToken = request.user;
        response.json({ token: jwtToken });
    }
);

router.get("/google");
router.get("/line");

export default router;
