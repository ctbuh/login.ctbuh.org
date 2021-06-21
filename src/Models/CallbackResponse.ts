import {Request} from "express";

export class CallbackResponse {

    public code: string = "";
    public sfdc_community_id: string = "";
    public sfdc_community_url: string = "";

    static fromRequest(req: Request): CallbackResponse {

        const query = req.query;

        let self = new this();
        Object.assign(self, query);

        return self;
    }
}