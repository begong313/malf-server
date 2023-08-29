import { AdRoute } from "./routes/ad.route";
import { AuthRoute } from "./routes/auth.route";
import { BulletinBoardRouter } from "./routes/bulletinBoard.route";
import { ChatRoomRouter } from "./routes/chatRoom.route";
import { PictureRouter } from "./routes/picture.route";
import { TestRoute } from "./routes/test.route";
import { UserInfoRouter } from "./routes/userInfo.route";
import { Server } from "./Server";
import webSocket from "./socket";

try {
    const app = new Server([
        new AuthRoute(),
        new AdRoute(),
        new UserInfoRouter(),
        new BulletinBoardRouter(),
        new ChatRoomRouter(),
        new TestRoute(),
        new PictureRouter(),
    ]);
    const server = app.listen();
    webSocket(server, app.app);
} catch (err) {
    console.log(err);
}
