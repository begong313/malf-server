import multer from "multer";
import multerS3 from "multer-s3";
import s3_config from "../config/s3_config";

// const storage: multer.StorageEngine = multer.diskStorage({
//     destination: function (req, file, cb): void {
//         cb(null, "public/images");
//     },
//     filename: function (req, file, cb): void {
//         //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
//         const uniqueSuffix =
//             Date.now() +
//             "-" +
//             Math.round(Math.random() * 1e9) +
//             "." +
//             file.mimetype.split("/")[1];
//         cb(null, uniqueSuffix);
//     },
// });
// const upload: multer.Multer = multer({ storage: storage });

const upload: multer.Multer = multer({
    storage: multerS3({
        s3: s3_config,
        bucket: "malf-live",
        key: function (req, file, cb): void {
            //사진파일 이름, 형식 설정, (나중에 유저 Id까지 들어가면 완벽히 Unique할듯) (보안??)
            const uniqueSuffix =
                Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                "." +
                file.mimetype.split("/")[1];
            cb(null, uniqueSuffix);
        },
    }),
});
export default upload;
