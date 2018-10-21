const userModel = require('./userModel');

async function createUser(username, password, email)
{
    await console.log('called createUser, username =', username, ', password =', password, ', email =', email);

    let user = await userModel.findOne({ 'username': username });
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

async function getAll()
{
    await console.log('called get all users');
    return { 'users': await userModel.find().select('username userId -_id')};
}

async function getById(id)
{
    await console.log('called get user by id');

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
    await console.log('called get user by username');
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
    getAll,
    getById,
    getByUsername
};
