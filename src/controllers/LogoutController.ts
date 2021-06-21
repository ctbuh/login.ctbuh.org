import {Request, Response} from "express";


export const LogoutController = function (req: Request, res: Response) {


    res.send('token remoked');

}