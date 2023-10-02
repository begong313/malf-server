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
    gif: String,

    date: {
        type: Number,
        default: Date.now,
    },
});

export default mongoose.model("Chat", chatSchema);
