import expressJwt from 'express-jwt';
import userService from './user/userService';
import { secret } from './constants';

function jwt()
{
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users/register'
        ]
    });
}

export default jwt;
