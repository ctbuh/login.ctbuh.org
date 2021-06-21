import {Request, Response} from "express";
import {dateHoursFromNow} from "../Util";
import {Client} from "../Client";
import {UrlBuilder} from "../classes/UrlBuilder";
import {AuthRequest} from "../requests/AuthRequest";

const force = new Client();

export const AuthController = function (req: Request, res: Response) {

    const authRequest = new AuthRequest(req);

    const session = req.session;
    const next = authRequest.nextNextUrl();

    // if already logged in: redirect back to next with ?token
    if (session && false) {

        if (!next) {

            res.send({
                error: 'Missing ?next= parameter'
            });

            return;
        }

        const nextUrlWithToken = UrlBuilder.generateNextUrl(next, session.token);

        // TODO: if nothing was found -> redirect to DEFAULT/?token=
        return res.redirect(302, nextUrlWithToken);
    }

    res.cookie('next', authRequest.getNextFromQuery(), {
        expires: dateHoursFromNow(2)
    });

    // otherwise, send to ConfigSalesforce
    let url = force.getAuthUrl();

    // res.send(url);
    res.redirect(302, url);

};