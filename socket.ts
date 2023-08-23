import SocketIO, { Socket } from "socket.io";

module.exports = (server: any) => {
    const io = new SocketIO.Server(server, { path: "/chatTest" });

    io.on("connection", (socket: Socket) => {
        // 웹소켓 연결 시
        const req = socket.request;
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        console.log("새로운 클라이언트 접속!", ip, socket.id);

        //Test 를 위한 Interval message
        const interval = setInterval(() => {
            socket.emit("news", {
                id: "test_1",
                message: "news : test_1 message",
            });
        }, 10000);

        socket.on("disconnect", () => {
            // 연결 종료 시
            console.log("클라이언트 접속 해제", ip, socket.id);
            clearInterval(interval);
        });

        socket.on("error", (error) => {
            // 에러 시
            console.error(error);
        });

        socket.on("reply", (data) => {
            // 클라이언트로부터 메시지를 받으면?
            console.log(data);
            socket.emit("chat", { data });
        });

        socket.on("chat", (data) => {
            console.log(data);
            socket.emit("chat", { data });
        });
    });
};
