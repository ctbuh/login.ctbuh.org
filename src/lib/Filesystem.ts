import {Logger} from "./Logger";
import {StringUtil} from "./StringUtil";

const fs = require('fs');
const os = require('os');
const path = require('path');

export class Filesystem {

    static testingCreatingTempFile(sizeInMb: number = 10): boolean {

        let fp = os.tmpdir() + path.sep + StringUtil.randomString(32) + '.txt';
        let data = StringUtil.randomString(Math.pow(10, 6) * sizeInMb);

        let status = false;

        try {
            fs.writeFileSync(fp, data);
            status = true;
        } catch (err) {
            status = false;
        } finally {
            this.deleteQuietly(fp);
        }

        return status;
    }

    static deleteQuietly(path: string): void {

        try {
            fs.unlinkSync(path)
        } catch (err) {
            Logger.error(err);
        }
    }
}