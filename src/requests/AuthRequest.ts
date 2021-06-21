import {Request} from 'express';
import {UrlBuilder} from "../classes/UrlBuilder";
import {StringOrNull} from "../types";

export class AuthRequest {

    private request: Request;

    constructor(req: Request) {
        this.request = req;
    }

    public getNextFromQuery(): string {
        return this.request.query['next'] as string;
    }

    public nextNextUrl(): StringOrNull {

        const nextFromQuery = this.getNextFromQuery();
        const nextFromCookie = this.request.cookies['next'] as string;

        if (nextFromQuery && UrlBuilder.isValidUrl(nextFromQuery)) {
            return nextFromQuery;
        }

        if (nextFromCookie && UrlBuilder.isValidUrl(nextFromCookie)) {
            return nextFromCookie;
        }

        return null;
    }

    public isValid() {
        // TODO
    }
}