import dotenv from "dotenv";

dotenv.config();

interface passportConfig {
    jwt: {
        secretKey: string;
    };
    kakao: {
        clientID: string;
        callbackURL: string;
    };
    google: {};
    line: {};
}

const passportConfig: passportConfig = {
    jwt: {
        secretKey: process.env.JWT_SIGN || "",
    },
    kakao: {
        clientID: process.env.KAKAO_ID || "",
        callbackURL: "/auth/kakao/callback",
    },
    google: {},
    line: {},
};

export { passportConfig };
