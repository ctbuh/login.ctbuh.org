import {Request, Response} from "express";
import {CallbackResponse} from "../Models/CallbackResponse";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";
import {dateYearFromNow} from "../Util";
import {Client} from "../Client";
import {asyncHandler} from "../types";

const force = new Client();

export const CallbackController = asyncHandler(async function (req: Request, res: Response) {

    const callbackResponse = CallbackResponse.fromRequest(req);

    // can fail
    let userInfo = await force.exchangeAuthCodeForToken(callbackResponse.code);

    const newSession: LoginSessionOrNull = await SessionRepository.createSessionFromAuthResponse(userInfo);

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

