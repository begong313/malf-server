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

    const chat = io.of("/chat");
    chat.on("connection", (socket: Socket) => {
        console.log(" chat 네임스페이스에 접속");
        socket.on("join", (data) => {
            //todo :  mysql로 가서 채팅방이 존재하는지 검사해야함
            console.log("방번호 ", data, "접속인 Id", data.sender);
            // data는 방 id. Id값으로 방에 접속
            // 방 들어올수 있는 권한있나 체크
            socket.join(data.room); // 네임스페이스 아래에 존재하는 방에 접속
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
                chat.to(data.room).emit("chat", chatdata);
            } catch (err) {
                console.log("EEERR", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("chat 네임스페이스 접속 해제");
        });
    });
}

export default webSocket;
