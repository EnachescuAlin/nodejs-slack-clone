import expressJwt from 'express-jwt';
import userService from './user/userService';
import { secret } from './constants';

function jwt()
{
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/login',
            '/api/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    if (!user) {
        return done(null, true);
    }

    done();
};

export default jwt;
