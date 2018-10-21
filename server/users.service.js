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

module.exports = {
    createUser,
};
