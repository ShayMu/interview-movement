const jwt = require('jsonwebtoken');
const routeErrors = require('../utils/errors').routeErrors;
const app = require('../services/app.service');
const usersModel = require('../models/users.model');

const authTokenHeader = 'x-auth-token';

function buildCorsAuth(req, res) {
    const cors = require('cors');
    const corsOptions = {
        exposedHeaders: [authTokenHeader],
        allowedHeaders: '*',
        origin: function (origin, callback) {
            const whitelist = ['http://localhost', 'https://www.google.com', 'https://www.facebook.com'];
            if (whitelist.find(allowedOrg=>origin.startsWith(allowedOrg))) {
                callback(null, true);
            } else {
                callback('Not allowed by CORS - ' + origin);
            }
        }   
    };

    return cors(corsOptions);
}


async function userAuth(req, res, next) {
    const token = req.headers[authTokenHeader];
    if (token) {
        try {
            const decoded = jwt.verify(token, app.config.authTokenSecret);
            req.user = usersModel.getUserByToken(decoded.token);
            if (!req.user) return next(routeErrors.auth.MISSING_TOKEN)
        } catch (err) {
            return next(routeErrors.auth.MISSING_TOKEN);
        }
    }
    else {
        let authBody = req.auth || {username: req.headers.authusername, password: req.headers.authpassword};
        if (!authBody) return next(routeErrors.auth.INVALID_CRED);
        let userToken = await usersModel.verifyUserPassword(authBody.username, authBody.password);
        if (!userToken) return next(routeErrors.auth.INVALID_CRED);

        res.set({[authTokenHeader]: jwt.sign({token: userToken}, app.config.authTokenSecret)});
    }

    next();
}

module.exports = {
    userAuth,
    buildCorsAuth
}