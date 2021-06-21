import {Singleton} from "./classes/Singleton";

require('dotenv').config();

type StringOrUndefined = string | undefined;

export class SpecialConfig extends Singleton {
    static readonly ONE = 1;
    static readonly TWO = 2;
}

export const ConfigSalesforce = {
    client_id: process.env.SALESFORCE_OAUTH_CONSUMER_KEY,
    client_secret: process.env.SALESFORCE_OAUTH_CONSUMER_SECRET,

    oauth_login_url: process.env.SALESFORCE_OAUTH_DOMAIN,
    oauth_redirect_uri: process.env.SALESFORCE_OAUTH_REDIRECT_URI,

    api_username: process.env.SALESFORCE_API_USERNAME,
    api_password: process.env.SALESFORCE_API_PASSWORD,
    api_security_token: process.env.SALESFORCE_API_SECURITY_TOKEN
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
    SENTRY_DSN: process.env.SENTRY_DSN
}