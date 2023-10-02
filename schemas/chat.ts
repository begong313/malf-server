import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,

    createdAt: {
        type: Number,
        default: Date.now,
    },
});

export default mongoose.model("Chat", chatSchema);
