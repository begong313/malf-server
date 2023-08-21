import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

interface ServerConfig {
    serverURL: string;
}

const serverConfig: ServerConfig = {
    serverURL: process.env.SERVER_URL!,
};

export default serverConfig;
