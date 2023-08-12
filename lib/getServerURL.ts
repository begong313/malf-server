/* 환경에따라 서버의 url을 가져옴*/
function getServerUrl(): string {
    let server_url: string;

    switch (process.env.NODE_ENV) {
        case "production":
            server_url = process.env.MALF_SERVER_URL!;
        default:
            server_url = "http://localhost:8000/";
    }
    return server_url;
}

export default getServerUrl;
