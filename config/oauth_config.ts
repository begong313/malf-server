import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

interface oauthConfig {
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
    line: {
        clientID: string;
    };
    setting: {
        session: boolean;
        failureRedirect: string;
    };
}

const oauthConfig: oauthConfig = {
    jwt: {
        secretKey: process.env.JWT_SIGN!,
    },
    kakao: {
        clientID: process.env.KAKAO_ID!,
        callbackURL: "/auth/kakao/callback",
    },
    google: {
        clientID: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: "/auth/google/callback",
    },
    line: {
        clientID: process.env.LINE_ID!,
    },
    setting: {
        session: false,
        failureRedirect: "/auth/login-error",
    },
};

export { oauthConfig };
