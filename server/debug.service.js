const userModel = require('./userModel');
const countersModel = require('./countersModel');

async function deleteAllUsers()
{
    await console.log('called debug delete all users');
    await userModel.deleteMany({});
}

async function deleteAllCounters()
{
    await console.log('called debug delete all counters');
    await countersModel.deleteMany({});
}

async function getAllUsers()
{
    await console.log('called debug get all users');
    return await userModel.find();
}

async function getAllCounters()
{
    await console.log('called debug get all counters');
    return await countersModel.find();
}

module.exports = {
    deleteAllUsers,
    deleteAllCounters,
    getAllUsers,
    getAllCounters
};
