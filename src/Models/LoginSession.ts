import {Token} from "./Token";

export class LoginSession {

    public id: number = 0;
    public sid: string = '';
    public user_id: string = '';

    // SSO token
    public token: string = '';

    // from Salesforce
    public access_token: string = '';
    public refresh_token: string = '';

    getToken(): Token {
        let token = new Token();
        token.accessToken = this.access_token;
        token.refreshToken = this.refresh_token;
        return token;
    }
}