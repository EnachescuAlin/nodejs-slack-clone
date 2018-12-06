import expressJwt from 'express-jwt';
import UserService from '../user/userService';
import { secret } from '../constants';

const userService = new UserService();

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
    if (process.env.NODE_ENV === 'test') {
        return done();
    }

    let user;
    try {
        user = await userService.getById(payload.sub);
    } catch (error) {
        done(null, true);
    }

    if (!user) {
        return done(null, true);
    }

    done();
};

export default jwt;
