const lib = require('crypto');

export class Security {

    // hex for easier copy&pasting
    static getRandomToken = function (): string {
        let rand = lib.randomBytes(32);
        return rand.toString('base64');
    }

    static getRandomSessionId = function (): string {
        let rand = lib.randomBytes(32);
        return rand.toString('hex');
    }

    /*    static encrypt(text: string) {
            let cipher = lib.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
        }

        static decrypt(text: string) {
            let iv = Buffer.from(text.iv, 'hex');
            let encryptedText = Buffer.from(text.encryptedData, 'hex');
            let decipher = lib.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }*/
}

