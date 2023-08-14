import { AdRoute } from "./routes/ad.route";
import { AuthRoute } from "./routes/auth.route";
import { BulletinBoardRouter } from "./routes/bulletinBoard.route";
import { ChatRoomRouter } from "./routes/chatRoom.route";
import { PictureRouter } from "./routes/picture.route";
import { UserInfoRouter } from "./routes/userInfo.route";
import { Server } from "./Server";

const app = new Server([
    new AdRoute(),
    new AuthRoute(),

    new BulletinBoardRouter(),
    new ChatRoomRouter(),
    new PictureRouter(),
    new UserInfoRouter(),
]);
app.listen();
