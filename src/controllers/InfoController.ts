import {Request, Response} from "express";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";
import {asyncHandler} from "../types";
import {getCachedSessionInfo} from "../GetSessionInfo";
import {AppConfig} from "../config";

// 15 minutes by default
// @ts-ignore
const USER_INFO_CACHE_TTL: number = AppConfig.user_info_cache_ttl || (60 * 15);

export const MeController = asyncHandler(async function (req: Request, res: Response) {

    const session = req.session;

    if (session) {

        try {

            const info = await getCachedSessionInfo(session, USER_INFO_CACHE_TTL);
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

            const info = await getCachedSessionInfo(session, USER_INFO_CACHE_TTL);
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