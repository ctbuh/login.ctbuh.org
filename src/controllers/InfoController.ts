import {Request, Response} from "express";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";
import {asyncHandler} from "../types";
import {getCachedSessionInfo} from "../GetSessionInfo";

export const MeController = asyncHandler(async function (req: Request, res: Response) {

    const sid = req.cookies['sso_sid'];

    const session: LoginSessionOrNull = await SessionRepository.findFromSessionId(sid);

    if (session) {

        try {

            const info = await getCachedSessionInfo(session, 60 * 60);
            res.jsonp(info);

        } catch (ex) {

            // ErrorHandler.report(ex);

            res.status(401).jsonp({
                error: 'Invalid or expired login session'
            });
        }

        return;
    }

    res.jsonp({
        error: 'You are not logged in'
    });

});

export const InfoController = asyncHandler(async function (req: Request, res: Response) {

    const token: string = req.body['token'] || "";

    const session: LoginSessionOrNull = await SessionRepository.findFromToken(token);

    if (session) {

        try {

            const info = await getCachedSessionInfo(session, 60 * 60);
            res.json(info);

        } catch (ex) {

            // ErrorHandler.report(ex);

            res.status(401).json({
                error: 'Invalid or expired login session'
            });
        }

        return;
    }

    res.json({
        error: 'Invalid/Expired Token'
    });

});