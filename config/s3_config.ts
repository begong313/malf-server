import { S3Client } from "@aws-sdk/client-s3";

const s3_config: S3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region: "ap-northeast-2",
});

export default s3_config;
