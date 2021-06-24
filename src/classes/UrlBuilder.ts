export class UrlBuilder {

    static isValidUrl(url: string) {

        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    }

    static urlWithToken(url: string, token: string): string {
        return this.urlWithQueryParam(url, 'token', token);
    }

    // TODO: accept <string,string> map
    private static urlWithQueryParam(url: string, name: string, value: string) {

        let temp = new URL(url);
        temp.searchParams.append(name, value);

        return temp.toString();
    }

    static getRedirectUri() {

        const APP_URL = process.env.APP_URL || "";

        let url = new URL(APP_URL);
        url.pathname = '/callback';

        return url.toString();
    }
}