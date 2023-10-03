import SocketIO, { Socket } from "socket.io";
import express from "express";
import Chat from "./schemas/chat";
import mongoose from "mongoose";

function webSocket(server: any, app: express.Application) {
    const io = new SocketIO.Server(server, {
        path: "/chatTest",
        cors: {
            origin: "*",
        },
    });
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
            socket.emit("chat", { ...data, sendAt: Date.now() });
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
        console.log(" chat 네임스페이스에 접속");

        socket.on("join", (data) => {
            //todo :  mysql로 가서 채팅방이 존재하는지 검사해야함
            console.log("방번호 ", data);

            // data는 방 id. Id값으로 방에 접속
            socket.join(data.room); // 네임스페이스 아래에 존재하는 방에 접속
            const chatdata = new Chat({
                room: data.room,
                sender: data.sender || "notice",
                message: "방에 입장했습니다.",
                sendAt: Date.now(),
                type: 2,
            });

            chat.to(data.room).emit("join", chatdata);
        });

        socket.on("chat", async (data) => {
            try {
                //todo :  mysql로 가서 채팅방이 존재하는지 검사해야함
                const chatdata = new Chat({
                    room: data.room,
                    sender: data.sender,
                    message: data.message,
                    sendAt: Date.now(),
                    type: 0,
                });

                const collection = mongoose.connection.collection(data.room);
                await collection.insertOne(chatdata);
                console.log(chatdata);
                chat.to(data.room).emit("chat", chatdata);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            console.log("chat 네임스페이스 접속 해제");
        });
    });
}

export default webSocket;
