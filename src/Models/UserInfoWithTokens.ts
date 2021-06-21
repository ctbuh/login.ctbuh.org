import {UserInfo} from "jsforce";

export class UserInfoWithTokens {

    public userInfo: UserInfo;

    public instanceUrl: string = '';
    public accessToken: string = '';
    public refreshToken: string = '';

    constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }
}