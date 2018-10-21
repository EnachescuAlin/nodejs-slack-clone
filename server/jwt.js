const expressJwt = require('express-jwt');
const pathToRegexp = require('path-to-regexp');

const config = require('./config.json');
const usersService = require('./users.service');

function jwt()
{
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users/register',

            // debug routes
            '/debug/getAllUsers',
            '/debug/getAllCounters',
            '/debug/deleteAllUsers',
            '/debug/deleteAllCounters',
            /\/debug\/deleteUser\/*/,
            /\/debug\/deleteCounter\/*/
        ]
    });
}

async function isRevoked(req, payload, done)
{
    if (!await usersService.findById(payload.sub)) {
        return done(null, true);
    }
    
    done();
};

module.exports = jwt;
