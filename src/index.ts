import {HomeController} from "./controllers/HomeController";
import {CallbackController} from "./controllers/CallbackController";
import {AuthController} from "./controllers/AuthController";
import {InfoController, MeController} from "./controllers/InfoController";
import {LogoutController} from "./controllers/LogoutController";
import {Server} from "./Server";
import {SessionAuthMiddleware} from "./middleware/SessionAuthMiddleware";

// TODO: validate config before starting server

const server = new Server();

let router = server.getRouter();
router.use(SessionAuthMiddleware);

router.get('/', HomeController);
router.get('/auth', AuthController);
router.get('/callback', CallbackController);

router.get('/me', MeController);
router.post('/info', InfoController);

router.get('/logout', LogoutController);

// @ts-ignore
const port: number = process.env.PORT || 3000;

server.start(port);


