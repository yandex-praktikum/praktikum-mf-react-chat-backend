const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const audit = require('express-requests-logger');
const log = require('bunyan').createLogger({name: "mf-react-backend"});

const configureAuth = require('./auth');
const configureSocket = require('./socket');
const configureUser = require('./user');



var whiteRegexp = new RegExp(/http:\/\/localhost:.*/).compile();
var corsOptions = {
    origin: function (origin, callback) {
        if (whiteRegexp.test(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}
app.use(cors(corsOptions));

app.use(audit({
    logger: log, // Existing bunyan logger
    excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
request: {
    maskBody: ['password'], // Mask 'password' field in incoming requests
    excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
    maxBodyLength: 50 // limit length to 50 chars + '...'
},
response: {
    maskBody: ['session_token'], // Mask 'session_token' field in response body
    excludeHeaders: ['*'], // Exclude all headers from responses,
    excludeBody: ['*'], // Exclude all body from responses
    maxBodyLength: 50 // limit length to 50 chars + '...'
}
}));

app.use(express.json());
app.use(express.static('src/mockData'));
const sessionMiddleware = configureAuth(app);
configureSocket(http, sessionMiddleware);
configureUser(app);

const PORT = process.env.PORT || 5050;

http.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

