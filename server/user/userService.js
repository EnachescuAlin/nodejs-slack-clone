import User from './user';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { secret } from '../constants';

async function createUser(user)
{
    const existingUser = await User.findOne({ 'username': user.username });
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

async function login(username, password)
{
    const user = await User.findOne({ 'username': username });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'username or password is incorrect';
    }

    await User.findOneAndUpdate({ 'username': username }, { $set: { 'online': true }});

    const token = sign({ sub: user._id }, secret);
    return { 'token': token };
}

async function logout(userId)
{
    await User.findOneAndUpdate({ '_id': userId }, { $set: { 'online': false }});
}

async function getAll()
{
    return (await User.find()).map(user => user.toDto());
}

async function getById(userId)
{
    const user = await User.findOne({ '_id': userId });
    if (!user) {
        throw 'not found user with id = ' + userId;
    }
    return user.toDto();
}

async function getByUsername(userName)
{
    const user = await User.findOne({ 'username': userName });
    if (!user) {
        throw 'not found user with username = ' + userName;
    }
    return user.toDto();
}

export default {
    createUser,
    login,
    logout,
    getAll,
    getById,
    getByUsername,
};
