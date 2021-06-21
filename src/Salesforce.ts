import {AppConfig, ConfigSalesforce} from "./config";

export class Salesforce {

    static getRedirectUri() {

        // typically empty on production
        const redirectUri = ConfigSalesforce.oauth_redirect_uri;

        if (redirectUri) {
            return redirectUri;
        }

        const appUrl = AppConfig.app_url as string;

        return (new URL(appUrl)).origin + '/callback';
    }
}