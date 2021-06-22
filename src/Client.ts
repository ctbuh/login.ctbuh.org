import {Connection, OAuth2} from "jsforce";
import {UserInfoWithTokens} from "./Models/UserInfoWithTokens";
import {Token} from "./Models/Token";
import {ConfigSalesforce} from "./config";
import {StringCallback} from "./types";
import {Salesforce} from "./Salesforce";

const jsforce = require('jsforce');

const CONFIG = ConfigSalesforce;

export class Client {

    protected oauth2: OAuth2;
    protected connection: Connection;

    constructor() {

        this.oauth2 = new jsforce.OAuth2({
            // you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl: 'https://' + CONFIG.oauth_login_url,
            // loginUrl: 'https://login.salesforce.com',
            clientId: CONFIG.client_id,
            clientSecret: CONFIG.client_secret,
            redirectUri: Salesforce.getRedirectUri()
        });

        this.connection = new jsforce.Connection({
            oauth2: this.oauth2
        });
    }

    getAuthUrl(): string {

        return this.oauth2.getAuthorizationUrl({
            scope: 'openid api refresh_token'
        });
    }

    async exchangeAuthCodeForToken(code: string): Promise<UserInfoWithTokens> {

        let userInfo = await this.connection.authorize(code);

        let result = new UserInfoWithTokens(userInfo);
        result.instanceUrl = this.connection.instanceUrl;
        result.accessToken = this.connection.accessToken;
        result.refreshToken = this.connection.refreshToken || "";

        return result;
    }

    public getConnection(token: Token, refreshCallback: StringCallback): Connection {

        let connection: Connection = new jsforce.Connection({
            oauth2: this.oauth2,
            // should be parsed from TOKEN. Defaults to: login.ConfigSalesforce.com
            instanceUrl: 'https://' + CONFIG.oauth_login_url,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        });

        connection.on("refresh", async function (accessToken) {
            refreshCallback(accessToken);
        });

        return connection;
    }
}
