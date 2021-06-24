declare namespace Express {

    interface Request {
        session: import("../../SessionRepository").LoginSessionOrNull
    }
}
