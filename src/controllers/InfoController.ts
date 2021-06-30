import {Request, Response} from "express";
import {LoginSessionOrNull, SessionRepository} from "../SessionRepository";
import {asyncHandler} from "../types";
import {forgetSessionCache, getCachedSessionInfo} from "../GetSessionInfo";
import {AppConfig} from "../config";
import {Logger} from "../lib/Logger";

// 15 minutes by default
// @ts-ignore
const USER_INFO_CACHE_TTL: number = AppConfig.user_info_cache_ttl || (60 * 15);

export const MeController = asyncHandler(async function (req: Request, res: Response) {

    const session = req.session;
    const fresh: boolean = !!(req.query['fresh'] as string) || false;

    if (session) {

        try {

            if (fresh) {
                await forgetSessionCache(session);
            }

            const info = await getCachedSessionInfo(session, USER_INFO_CACHE_TTL);
            res.jsonp(info);

        } catch (ex) {

            Logger.info(ex);

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
    const fresh: boolean = req.body['fresh'] || false;

    const session: LoginSessionOrNull = await SessionRepository.findFromToken(token);

    if (session) {

        try {

            if (fresh) {
                await forgetSessionCache(session);
            }

            const info = await getCachedSessionInfo(session, USER_INFO_CACHE_TTL);
            res.json(info);

        } catch (ex) {

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