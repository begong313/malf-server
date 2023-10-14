import { AdRoute } from "./routes/ad.route";
import { AuthRoute } from "./routes/auth.route";
import { BulletinBoardRouter } from "./routes/bulletinBoard.route";
import { ChatRouter } from "./routes/chat.route";
import { ChatRoomRouter } from "./routes/chatRoom.route";
import { PictureRouter } from "./routes/picture.route";
import { ReviewRouter } from "./routes/review.route";
import { TestRoute } from "./routes/test.route";
import { UserRouter } from "./routes/user.route";
import { Server } from "./Server";
import webSocket from "./socket";

try {
    const app = new Server([
        new AuthRoute(),
        new AdRoute(),
        new UserRouter(),
        new BulletinBoardRouter(),
        new ChatRoomRouter(),
        new TestRoute(),
        new PictureRouter(),
        new ChatRouter(),
        new ReviewRouter(),
    ]);
    const server = app.listen();
    webSocket(server, app.app);
} catch (err) {
    console.log(err);
}
