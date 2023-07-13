/* response Json 객체의 형식을 관리하는 파일 */

import { OkPacket } from "mysql";

export type Status = "OK" | "Fail";

interface GenericResponse {
    status: Status;
    post_id?: number;
    data?: OkPacket;
}

export class ServerResponse {
    private response: any;

    constructor() {
        this.response = {
            status: "OK",
        };
    }

    public getOKResponse(data: OkPacket): GenericResponse {
        this.response.status = "OK";
        this.response.data = data;
        return this.response;
    }

    public postOKResponse(post_id: number): GenericResponse {
        this.response.status = "OK";
        this.response.post_id = post_id;
        return this.response;
    }

    public deleteOKResponse(): GenericResponse {
        return this.response;
    }

    public FailResponse(): GenericResponse {
        this.response.status = "Fail";
        return this.response;
    }
}
