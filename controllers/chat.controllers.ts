import { NextFunction, Request, Response } from "express";

import { HttpException } from "../exeptions/HttpException";
import mongoose from "mongoose";
import Chat from "../schemas/chat";

export class ChatController {
    // public chatRoom = Container.get(ChatModel);

    //쌓인 채팅 가져오기
    public getChat = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const room_id: string = request.params.id;
            const collection = mongoose.connection.collection(room_id);
            const messages = await collection.find().toArray();

            response.status(200).json({
                status: 200,
                data: messages,
            });
        } catch (err) {
            next(new HttpException(400, "채팅불러오기 실패"));
        }
    };

    //채팅방 사진 전송
    public sendImage = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const user_uniq_id = response.locals.decoded;
        const imageFiles: any = request.files;
        var picDIRList: string[] = []; //사진 경로 담을 array
        //첨부사진이 없을 때
        if (imageFiles == undefined) {
            console.log("사진못받음");
            next(new HttpException(400, "사진을 첨부해주세요"));
            return;
        } else {
            //사진 dir정보
            for (var i = 0; i < imageFiles.length; i++) {
                picDIRList.push(imageFiles[i].filename);
            }
        }
        console.log("사진을 받았나?", picDIRList);
        const io = request.app.get("io").of("/chat");
        const room = request.params.id;
        console.log(room);
        console.log(user_uniq_id);
        const chatdata = new Chat({
            sender: user_uniq_id || "default",
            room: request.params.id,
            sendAt: Date.now(),
            message: JSON.stringify(picDIRList),
            type: 1,
        });
        io.to(room).emit("image", chatdata);
        response.status(200).json({
            status: 200,
            message: "전송 성공",
        });
    };

    /* 만들어야 할 기능 
1. 주석의 Todo들
2. lock 을 사용해야 할거같음. 신청요청과 승락이 동시에 이루어지면 곤란한 상황 발생
*/
}
