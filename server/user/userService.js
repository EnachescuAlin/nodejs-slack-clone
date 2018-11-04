import User from './user';
import {
    sign
} from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {
    secret
} from '../constants';
import NotFoundError from '../errors/notFoundError';
import mongoose from 'mongoose';

class UserService {

    async createUser(user) {
        const existingUser = await User.findOne({
            'username': user.username
        });
        if (existingUser) {
            throw 'Username "' + username + '" already exists';
        }

        const newUser = new User();
        newUser.username = user.username;
        newUser.passwordHash = bcrypt.hashSync(user.password);
        newUser.email = user.email;
        newUser.firstname = user.firstname;
        newUser.lastname = user.lastname;
        await newUser.save();
        return newUser.toDto();
    }

    async login(username, password) {
        const user = await User.findOne({
            'username': username
        });
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            throw 'username or password is incorrect';
        }

        await User.findOneAndUpdate({
            'username': username
        }, {
            $set: {
                'online': true
            }
        });

        const token = sign({
            sub: user._id
        }, secret);
        return {
            'token': token
        };
    }

    async logout(userId) {
        await User.findOneAndUpdate({
            '_id': userId
        }, {
            $set: {
                'online': false
            }
        });
    }

    async getAll() {
        return (await User.find()).map(user => user.toDto());
    }

    async getById(userId) {
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const user = await User.findOne({
                '_id': userId
            });
            if (!user) {
                throw new NotFoundError(`User with id ${userId} was not found`);
            }
            return user.toDto();
        } else
            throw new NotFoundError(`User with id ${userId} was not found`);
    }

    async getByUsername(userName) {
        const user = await User.findOne({
            'username': userName
        });
        if (!user) {
            throw new NotFoundError(`User with username ${userName} was not found`);
        }
        return user.toDto();
    }

    async update(id, user) {
        const existingUser = await User.findById(id);
        if (!existingUser) throw new NotFoundError(`User with id ${id} was not found`);
        if (existingUser.username !== user.username && await User.findOne({
                username: user.username
            })) {
            throw 'Username "' + user.username + '" is already taken';
        }
        if (user.password) {
            existingUser.passwordHash = bcrypt.hashSync(user.password);
        }
        Object.assign(existingUser, user);

        await existingUser.save();
    }

    async remove(id) {
        const existingUser = await User.findById(id);
        if (!existingUser) throw new NotFoundError(`User with id ${id} was not found`);
        await existingUser.remove();
    }
};

export default UserService;