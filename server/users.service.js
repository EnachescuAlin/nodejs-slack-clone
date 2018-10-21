const userModel = require('./userModel');
const jwt = require('jsonwebtoken');

const config = require('./config.json');

async function createUser(username, password, email)
{
    await console.log('called createUser, username =', username, ', password =', password, ', email =', email);

    const user = await userModel.findOne({ 'username': username });
    if (user) {
        await console.log('username =', username, ' already exists');
        throw 'Username "' + username + '" already exists';
    }

    const newUser = new userModel();
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;

    await newUser.save();
}

async function login(username, password)
{
    await console.log('called login, username =', username, ', password =', password);

    const user = await userModel.findOne({ 'username': username, 'password': password });
    if (!user) {
        await console.log('invalid username =', username, ' or password =', password);
        throw 'username or password is incorrect';
    }

    const token = jwt.sign({ sub: user.userId }, config.secret);
    return { 'token': token };
}

async function findById(id)
{
    await console.log('called findById, id =', id);

    if (await userModel.find({ 'userId': id})) {
        return true;
    }
    return false;
}

async function getAll()
{
    await console.log('called get all users');
    return { 'users': await userModel.find().select('username userId -_id')};
}

async function getById(id)
{
    await console.log('called get user by id =', id);

    const user = await userModel.findOne({ 'userId': id });
    if (!user) {
        await console.log('not found user with id =', id);
        throw 'not found user with id = ' + id;
    }

    const {
        userId, username, email, registerDate, status, online,
        ...dropField
    } = user;
    return { 'user': { userId, username, email, registerDate, status, online }};
}

async function getByUsername(username)
{
    await console.log('called get user by username =', username);

    const user = await userModel.findOne({ 'username': username });
    if (!user) {
        await console.log('not found user with username =', username);
        throw 'not found user with username = ' + username;
    }

    const {
        userId, name, email, registerDate, status, online,
        ...dropField
    } = user;
    return { 'user': { userId, username, email, registerDate, status, online }};
}

module.exports = {
    createUser,
    login,
    findById,
    getAll,
    getById,
    getByUsername
};
