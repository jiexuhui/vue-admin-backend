import expressJwt from 'express-jwt';

import { config } from './config';

const whiteList = [
    /^\/docs/,
    /^\/api-docs/,
    /^\/admin\/system\/login/,
];

export function setupAuth(app) {
    app.use(expressJwt({
        secret: config.auth.jwt_secret,
        algorithms: ['HS256'],
        getToken: fromHeaderOrQuerystring,
    }).unless({
        path: whiteList,
    }),
    )
}

function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization) {
        return req.headers.authorization;
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
}
