require('dotenv').config();

const express = require('express');

const redis = require('redis');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();

app.use(cookieParser());

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient();

// Otherwise, it will expire the session using the ttl option (default: 86400 seconds or one day).
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.APP_KEY,
    resave: false
}));

app.use(cors({
    // origin: true
}));

app.set('trust proxy', true);

app.use(express.static(__dirname + '/public'));

module.exports = app;