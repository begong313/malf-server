import multer from "multer";
import multerS3 from "multer-s3";
import s3_config from "../config/s3_config";

const uploadImage: multer.Multer = multer({
    storage: multerS3({
        s3: s3_config,
        bucket: "malf-live",
        key: function (req, file, cb): void {
            const folerPath = "images";
            //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
            const uniqueSuffix =
                folerPath +
                "/" +
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                "." +
                file.mimetype.split("/")[1];
            cb(null, uniqueSuffix);
        },
    }),
});
const uploadProfile: multer.Multer = multer({
    storage: multerS3({
        s3: s3_config,
        bucket: "malf-live",
        key: function (req, file, cb): void {
            const folerPath = "Profile";
            //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
            const uniqueSuffix =
                folerPath +
                "/" +
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                "." +
                file.mimetype.split("/")[1];
            cb(null, uniqueSuffix);
        },
    }),
});
const uploadChat: multer.Multer = multer({
    storage: multerS3({
        s3: s3_config,
        bucket: "malf-live",
        key: function (req, file, cb): void {
            const folerPath = "chatting";
            //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
            const uniqueSuffix =
                folerPath +
                "/" +
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                "." +
                file.mimetype.split("/")[1];
            cb(null, uniqueSuffix);
        },
    }),
});

export { uploadImage, uploadProfile, uploadChat };
