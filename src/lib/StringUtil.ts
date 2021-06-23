const crypto = require('crypto');

export class StringUtil {

    // https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L14273
    static escapeRegExp(str: string): string {
        const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
        return str.replace(reRegExpChar, '\\$&');
    }

    static stringReplaceAll(str: string, search: string[]) {

        search.forEach((value: string) => {
            let re = new RegExp(this.escapeRegExp(value), 'g');
            str = str.replace(re, '');
        });

        return str;
    }

    // https://github.com/laravel/framework/blob/master/src/Illuminate/Support/Str.php#L530
    static randomString = function (len: number = 16): string {

        const remove = ['/', '+', '='];
        const allowed = [];

        let result = '';

        while (result.length !== len) {

            let buffer = crypto.randomBytes(len);

            let temp = buffer.toString('base64');
            temp = StringUtil.stringReplaceAll(temp, remove);

            // how much do we still need
            result += temp.substring(0, (len - result.length));
        }

        return result;
    }
}