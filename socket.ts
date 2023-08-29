import SocketIO, { Socket } from "socket.io";
import express from "express";

function webSocket(server: any, app: express.Application) {
    const io = new SocketIO.Server(server, { path: "/chatTest" });
    app.set("io", io);
    io.on("connection", (socket: Socket) => {
        console.log("유저 접속");
        /*Test를위한코드*/
        const interval = setInterval(() => {
            socket.emit("news", {
                id: "test_1",
                message: "news : test_1 message",
            });
        }, 5000);

        socket.on("disconnect", () => {
            // 연결 종료 시
            console.log("클라이언트 접속 해제", socket.id);
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
    /*Test를위한코드*/
    const room = io.of("/room");
    room.on("connection", (socket: Socket) => {
        console.log("room 네임스페이스에 접속");
        socket.on("disconnect", () => {
            console.log("room 네임스페이스 접속 해제");
        });
    });

    const chat = io.of("/chat");
    chat.on("connection", (socket: Socket) => {
        // const interval = setInterval(() => {
        //     socket.emit("news", "hello socket.io");
        // }, 1000);
        console.log(" chat 네임스페이스에 접속");

        socket.on("join", (data) => {
            // data는 방 id. Id값으로 방에 접속
            socket.join(data); // 네임스페이스 아래에 존재하는 방에 접속
            socket.to(data).emit("join", {
                user: "system",
                chat: `${data}에 입장하셨습니다.`,
            });
        });

        socket.on("disconnect", () => {
            console.log("chat 네임스페이스 접속 해제");
        });
    });
}

export default webSocket;
