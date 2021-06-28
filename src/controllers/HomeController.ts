import {Request, Response} from "express";
import {UrlBuilder} from "../classes/UrlBuilder";
import {AppConfig} from "../config";

export const HomeController = function (req: Request, res: Response, next: any) {

    const session = req.session;
    const cookieNext = req.cookies['next'];

    // We are already logged in - so where should we redirect next?
    if (session) {

        let nextWithToken = '';

        if (cookieNext) {
            nextWithToken = UrlBuilder.urlWithToken(cookieNext, session.token);
            console.log(`Redirect from cookies.next: ${nextWithToken}`);
        } else if (AppConfig.main_site_url) {
            nextWithToken = UrlBuilder.urlWithToken(AppConfig.main_site_url, session.token);
            console.log(`Redirect from main_site_url: ${nextWithToken}`);
        }

        if (nextWithToken) {

            /*            res.json({
                            redirectUri: nextWithToken
                        }).end();*/

            return res.redirect(302, nextWithToken);
        }

        //  return res.redirect(302, '/home.html');
    }

    res.json({
        message: 'Go to a site to which you wish to login'
    });

};