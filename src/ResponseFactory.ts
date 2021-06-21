import {Response} from "express";

export class ResponseFactory {

    success(res: Response, message: string) {
        return res.json({});
    }

}