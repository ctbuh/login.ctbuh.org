import {Request, Response} from "express";
import {SessionRepository} from "../SessionRepository";
import {asyncHandler} from "../types";
import {TokenClient} from "../TokenClient";

const tokenClient = new TokenClient();

export const LogoutController = asyncHandler(async function (req: Request, res: Response) {

    const session = req.session;
    const referer = req.header('Referer');

    if (session) {

        // revoke all tokens INCLUDING refresh first
        await tokenClient.revokeQuietly(session.getToken(), true);

        // mark Session as expired in database
        await SessionRepository.revoke(session);

        // remove session cookie too
        res.clearCookie('sso_id');
    }
    
    if (referer) {
        res.redirect(302, referer);
        return;
    }

    res.redirect(302, '/');

});