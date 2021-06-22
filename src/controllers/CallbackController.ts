import {Request, Response} from "express";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";
import {dateYearFromNow} from "../Util";
import {Client} from "../Client";
import {asyncHandler} from "../types";
import {CallbackRequest} from "../requests/CallbackRequest";
import {UserInfoWithTokens} from "../Models/UserInfoWithTokens";

const force = new Client();

export const CallbackController = asyncHandler(async function (req: Request, res: Response) {

    const request = new CallbackRequest(req);

    // can fail
    let userInfo: UserInfoWithTokens = await force.exchangeAuthCodeForToken(request.code);

    const newSession: LoginSessionOrNull = await SessionRepository.createSessionFromAuthResponse(userInfo, request);

    if (newSession) {

        res.cookie('sso_sid', newSession.sid, {
            expires: dateYearFromNow(),
            sameSite: 'none',
            secure: true
        });

        return res.redirect(302, '/');
    }

    res.status(400).json({
        error: 'Authorization failed. Try again later.'
    });

});

