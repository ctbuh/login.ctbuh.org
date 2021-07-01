import {Request, Response} from "express";
import {Filesystem} from "../lib/Filesystem";
import {SessionRepository} from "../SessionRepository";

export const HealthCheckController = async function (req: Request, res: Response) {

    let data = {
        uptime: process.uptime(),
        time: Date.now(),
        disk: Filesystem.testingCreatingTempFile(),
        database: await SessionRepository.ping(),
    }

    let status = (data.disk && data.database) ? 200 : 503;

    res.status(status).json(data);
}