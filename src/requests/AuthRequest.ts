import {Request} from 'express';
import {UrlBuilder} from "../classes/UrlBuilder";
import {pingSession} from "../GetSessionInfo";

export class AuthRequest {

    private request: Request;

    constructor(req: Request) {
        this.request = req;
    }

    public isLoggedIn(): boolean {
        return this.request.session !== null;
    }

    public async isSessionValid(): Promise<boolean> {

        if (this.request.session) {
            return await pingSession(this.request.session);
        }

        return false;
    }

    protected getNextFromQuery(): string {
        return this.request.query['next'] as string;
    }

    protected getNextFromCookie(): string {
        return this.request.cookies['next'] as string;
    }

    protected getNextFromReferer(): string {
        return this.request.header('Referer') as string;
    }

    public getNextFromQueryOrReferer(): string {
        return this.getNextFromQuery() || this.getNextFromReferer();
    }

    public findNextUrl(): string {

        // we are not logged in. We cannot go anywhere
        if (!this.request.session) {
            return "";
        }

        // token we must append to whatever URL we end up redirecting to
        const token = this.request.session.token;

        let validNextUrl: string = "";

        const nextFromQuery = this.getNextFromQuery();
        const nextFromCookie = this.getNextFromCookie();

        if (nextFromQuery && UrlBuilder.isValidUrl(nextFromQuery)) {
            validNextUrl = nextFromQuery;
        } else if (nextFromCookie && UrlBuilder.isValidUrl(nextFromCookie)) {
            validNextUrl = nextFromCookie;
        }

        // TODO: check if redirect is not back to itself
        if (validNextUrl) {
            return UrlBuilder.generateNextUrl(validNextUrl, token);
        }

        return "";
    }

    public isValid() {
        // TODO
    }
}