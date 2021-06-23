import {ConfigSalesforce} from "./config";
import {AxiosError, AxiosInstance, AxiosResponse} from "axios";
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
                //  'Authorization': base64(this.config.client_id + ':' + this.config.client_secret)
            }
        });
    }

    async introspect(token: string): Promise<IntrospectionResponse> {

        const _config = this.config;

        const response: AxiosResponse = await this.client.post('/services/oauth2/introspect', qs.stringify({
            'client_id': _config.client_id,
            'client_secret': _config.client_secret,
            'token': token,
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

    // TODO: make it return true or false whether revoking was a success
    async revokeQuietly(token: Token, invalidateBoth: boolean = false): Promise<void> {

        await this.client.post("/services/oauth2/revoke", qs.stringify({
            'token': invalidateBoth ? token.refreshToken : token.accessToken
        })).catch((err: AxiosError) => {
            // console.log(err.response?.data);
        });
    }
}
