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
import ProcessEntityError from '../errors/processEntityError';

class UserService {

    async createUser(user) {
        const existingUser = await User.findOne({
            'username': user.username
        });
        if (existingUser) {
            throw new ProcessEntityError(`Username ${user.username} already exists`);
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
            throw new ProcessEntityError('username or password is incorrect');
        }

        await User.findOneAndUpdate({
            'username': username
        }, {
            $set: {
                'online': true
            }
        });

        const token = sign({
            sub: user._id,
            name: user.username
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
        const user = await mongoose.Types.ObjectId.isValid(userId) ? 
            await User.findOne({
                '_id': userId
            }) : null;
        if (!user) {
            throw new NotFoundError(`User with id ${userId} was not found`);
        }
        return user.toDto();
    }

    async getByUsername(userName) {
        let query = {
            username: {
                $regex: `.*${userName}.*`,
                $options: 'i'
            }
        };
        return (await User.find(query)).map(user => user.toDto());
    }

    async update(id, user) {
        const existingUser = await mongoose.Types.ObjectId.isValid(id) ? await User.findById(id) : null;
        if (!existingUser) throw new NotFoundError(`User with id ${id} was not found`);
        if (existingUser.username !== user.username && await User.findOne({
                username: user.username
            })) {
            throw new ProcessEntityError('Username "' + user.username + '" is already taken');
        }
        if (user.password) {
            existingUser.passwordHash = bcrypt.hashSync(user.password);
        }
        Object.assign(existingUser, user);

        await existingUser.save();
    }

    async addDirectMessage(currentUserId, userId) {
        const currentUser = await mongoose.Types.ObjectId.isValid(currentUserId)
            ? await User.findById(currentUserId)
            : null;
        if (!currentUser)
            throw new NotFoundError(`User with id ${id} was not found`);

        const guestUser = await mongoose.Types.ObjectId.isValid(userId)
            ? await User.findById(userId)
            : null;
        if (!guestUser)
            throw new NotFoundError(`User with id ${id} was not found`);

        if (await currentUser.directMessages.find(obj => obj.equals(userId)))
            throw new ProcessEntityError('Already exists');

        await currentUser.directMessages.push(userId);
        await currentUser.save();
    }

    async remove(id) {
        const existingUser = await mongoose.Types.ObjectId.isValid(id) ? await User.findById(id) : null;
        if (!existingUser) throw new NotFoundError(`User with id ${id} was not found`);
        await existingUser.remove();
    }
};

export default UserService;