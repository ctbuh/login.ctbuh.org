import {Singleton} from "./classes/Singleton";
import Joi from "joi";

require('dotenv').config();

type StringOrUndefined = string | undefined;

export const ConfigSalesforce = {
    client_id: process.env.SALESFORCE_OAUTH_CONSUMER_KEY,
    client_secret: process.env.SALESFORCE_OAUTH_CONSUMER_SECRET,

    oauth_login_url: process.env.SALESFORCE_OAUTH_DOMAIN,
    oauth_redirect_uri: process.env.SALESFORCE_OAUTH_REDIRECT_URI,

    /*    api_username: process.env.SALESFORCE_API_USERNAME,
        api_password: process.env.SALESFORCE_API_PASSWORD,
        api_security_token: process.env.SALESFORCE_API_SECURITY_TOKEN*/
}

export class DatabaseConfig extends Singleton {
    public host: StringOrUndefined = process.env.DB_HOST;
    public database: StringOrUndefined = process.env.DB_DATABASE;
    public username: StringOrUndefined = process.env.DB_USERNAME;
    public password: StringOrUndefined = process.env.DB_PASSWORD;
}

export const AppConfig = {
    app_url: process.env.APP_URL,
    default_domain: process.env.DEFAULT_DOMAIN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    user_info_cache_ttl: process.env.USER_INFO_CACHE_TTL,
    main_site_url: process.env.MAIN_SITE_URL,
    cors_white_list: process.env.CORS_WHITELIST || ""
}


export const ConfigSchemaValidator = Joi.object({
    APP_URL: Joi.string().required(),
    SALESFORCE_OAUTH_CONSUMER_KEY: Joi.string().required(),
    SALESFORCE_OAUTH_CONSUMER_SECRET: Joi.string().required(),
    SALESFORCE_OAUTH_DOMAIN: Joi.string().required()
}).unknown();

