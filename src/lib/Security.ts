import {StringUtil} from "./StringUtil";

const lib = require('crypto');

export class Security {

    static getRandomToken = function (): string {
        return StringUtil.randomString(40);
    }

    static getRandomSessionId = function (): string {
        return StringUtil.randomString(32);
    }

    static base64(data: string): string {
        return Buffer.from(data).toString('base64');
    }

    static md5(data: string): string {
        return lib.createHash('md5').update(data).digest().toString('hex');
    }

    static encrypt(text: string, key: string) {

        const iv = lib.randomBytes(16);

        let cipher = lib.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let result = {
            iv: iv.toString('hex'),
            data: encrypted.toString('hex')
        };

        // laravel returns: iv, value, mac
        return Buffer.from(JSON.stringify(result)).toString('base64');
    }

    static decrypt(text: string, key: string) {

        const jsonString = Buffer.from(text, 'base64').toString();
        const parts = JSON.parse(jsonString);

        let iv = Buffer.from(parts.iv, 'hex');
        let encryptedText = Buffer.from(parts.data, 'hex');

        let decipher = lib.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}

