import mongoose from "mongoose";

const MONGO_ID = process.env.MONGO_ID || "root";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "root";
const NODE_ENV = process.env.NODE_ENV || "development";

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

const mongoConnect = () => {
    if (NODE_ENV !== "production") {
        mongoose.set("debug", true);
    }
    mongoose.connect(MONGO_URL, {
        dbName: "malfChat",
    });
};

mongoose.connection.on("error", (error) => {
    console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    mongoConnect();
});

export default mongoConnect;
