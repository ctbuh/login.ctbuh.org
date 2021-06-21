export class UrlBuilder {

    static changeUrlQueryParam(url: string, name: string, value: string) {

        try {
            let temp = new URL(url);
            temp.searchParams.append(name, value);

            return temp.toString();

        } catch (ex) {
            return null;
        }
    }

    static getUrlOrigin(one: URL, two: URL): boolean {

        return one.host === two.hash;
    }

    static isValidUrl(url: string) {

        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    }

    static generateNextUrl(next: string, token: string): string {

        let url = new URL(next);
        url.searchParams.set('token', token);

        return url.toString();
    }

    static getRedirectUri() {

        const APP_URL = process.env.APP_URL || "";

        let url = new URL(APP_URL);
        url.pathname = '/callback';

        return url.toString();
    }
}