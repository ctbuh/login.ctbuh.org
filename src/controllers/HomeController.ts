import {Request, Response} from "express";

export const HomeController = function (req: Request, res: Response, next: any) {
    return res.redirect(302, '/home.html');
};