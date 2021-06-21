import {ConfigSalesforce} from "./config";
import {AxiosInstance, AxiosResponse} from "axios";
import {IntrospectionResponse} from "./Models/IntrospectionResponse";
import {Token} from "./Models/Token";

const axios = require('axios');
const qs = require('qs');

export class TokenClient {

    protected client: AxiosInstance;
    protected config;

    constructor() {

        this.config = ConfigSalesforce;

        this.client = axios.create({
            baseURL: 'https://' + this.config.oauth_login_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //'Authorization': 'Bearer ' + token
            }
        });
    }

    async introspect(token: string): Promise<IntrospectionResponse> {

        const _config = this.config;

        const response: AxiosResponse = await this.client.post('/services/oauth2/introspect', qs.stringify({
            'client_id': _config.client_id,
            'client_secret': _config.client_secret,
            token: token,
            //  token_type_hint: 'refresh_token'
        }));

        let result = new IntrospectionResponse();

        Object.assign(result, response.data);

        return result;
    }

    async userInfo(token: Token) {

        const response: AxiosResponse = await this.client.post('/services/oauth2/userinfo', qs.stringify({
            access_token: token.accessToken
        }));

        return response.data;
    }

    async revokeQuietly(token: Token): Promise<void> {

        try {
            await this.client.post("/services/oauth2/revoke", qs.stringify({
                'token': token.accessToken
            }));
        } catch (ex) {
            // do nothing
        }
    }
}
