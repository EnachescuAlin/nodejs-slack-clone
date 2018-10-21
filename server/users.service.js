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

    const users = await userModel.find().select('username -_id');
    return users;
}

module.exports = {
    createUser,
    getAll
};
