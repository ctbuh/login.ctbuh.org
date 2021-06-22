import {Request} from 'express';

export class CallbackRequest {

    private request: Request;

    // Params we expect to get
    public code: string = "";
    public sfdc_community_id: string = "";
    public sfdc_community_url: string = "";

    constructor(req: Request) {
        this.request = req;
        this.fill();
    }

    protected fill() {
        const query = this.request.query;
        Object.assign(this, query);
    }

    public userAgent(): string {
        return this.request.header('user-agent') || "";
    }

    public getIp(): string {
        const req = this.request;
        return req.header('x-real-ip') || req.socket.remoteAddress || req.ip || "";
    }

    public validate(): boolean {
        return !this.code;
    }
}