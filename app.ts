import { BannerRouter } from "./routes/banner.route";
import { AuthRoute } from "./routes/auth.route";
import { BulletinBoardRouter } from "./routes/bulletinBoard.route";
import { ChatRouter } from "./routes/chat.route";
import { ChatRoomRouter } from "./routes/chatRoom.route";
import { ReportRouter } from "./routes/report.route";
import { ReviewRouter } from "./routes/review.route";
import { UserRouter } from "./routes/user.route";
import { Server } from "./Server";
import webSocket from "./socket";
import { CommunityRouter } from "./routes/community.route";

try {
    const app = new Server([
        new AuthRoute(),
        new BannerRouter(),
        new UserRouter(),
        new BulletinBoardRouter(),
        new ChatRoomRouter(),
        new ChatRouter(),
        new ReportRouter(),
        new ReviewRouter(),
        new CommunityRouter(),
    ]);
    const server = app.listen();
    webSocket(server, app.app);
} catch (err) {
    console.log(err);
}
