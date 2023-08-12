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
    google: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    };
    setting: {
        session: boolean;
        failureRedirect: string;
    };
}

const passportConfig: passportConfig = {
    jwt: {
        secretKey: process.env.JWT_SIGN || "",
    },
    kakao: {
        clientID: process.env.KAKAO_ID || "",
        callbackURL: "/auth/kakao/callback",
    },
    google: {
        clientID: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
        callbackURL: "/auth/google/callback",
    },
    setting: {
        session: false,
        failureRedirect: "/auth/login-error",
    },
};

export { passportConfig };
