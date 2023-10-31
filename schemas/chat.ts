import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    message: String,

    sendAt: {
        type: Number,
        default: Date.now,
    },

    // 0 : text, 1 : image, 2: 방입장 , 3:퇴장 공지
    type: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("Chat", chatSchema);
