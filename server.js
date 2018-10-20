const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const userModel = require('./userModel');
const counterModel = require('./countersModel');

class Server
{
    constructor()
    {
        mongoose.set('useCreateIndex', true)
        mongoose.connect('mongodb://localhost/slack_clone_db', { useNewUrlParser: true }, (err) => {
            if (err) {
                console.log('connect to database failed =', err);
            } else {
                console.log('connected to database successfully');
            }
        });

        //this.deleteAllCounters();
        //this.deleteAllUsers();

        this.initCounters();

        this.server = express(http);
        this.server.use(express.json());

        this.server.get('/', this.processingGet);
        this.server.get('/usersDebug', this.handleGetUsersDebug);

        this.server.post('/signUp', this.handleSignUp);
    }

    initCounters()
    {
        counterModel.findOne({ 'name': 'userId'}, (err, counter) => {
            if (err) {
                console.log('could not execute findOne, counter = userId');
                return;
            }
            if (counter) {
                console.log('counter userId already created, value =', counter.value);
                return;
            }

            const newCounter = new counterModel();
            newCounter.name = 'userId';
            newCounter.value = 1;

            newCounter.save((err, counter) => {
                if (err) {
                    console.log('save counter userId failed =', err);
                    return;
                }

                console.log('created counter userId successfully');
            });
        });
    }

    start(port)
    {
        this.server.listen(port, () => console.log('server started, port =', port));
    }

    processingGet(req, res)
    {
        res.send('Hello world');
    }

    handleSignUp(req, res)
    {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        console.log('handle sign up, username =', username, ', password =', password,
            ', email =', email);

        userModel.findOne({ 'username': username }, (err, user) => {
            if (err) {
                console.log('findOne failed =', err);
                res.send({ 'error': 'could not execute findOne method' });
                return;
            }
            if (user) {
                res.send({ 'error': 'user already exists' });
                return;
            }

            const newUser = new userModel();
            newUser.username = username;
            newUser.password = password;
            newUser.email = email;

            newUser.save((err, user) => {
                if (err) {
                    console.log('save new user failed =', err);
                    res.send({ 'error': 'could not save user' });
                    return;
                }

                console.log('created user, username =', user.username,
                    ', password =', user.password, ', email =', user.email);
                res.send({ 'error': 'ok' });
            });
        });
    }

    handleGetUsersDebug(req, res)
    {
        console.log('handle get users');
        userModel.find((err, users) => {
            if (err) {
                console.log('find users failed =', err);
                res.send({ 'error': 'could not get users' });
                return;
            }

            res.send(users);
        });
    }

    /*
     * cleanup database methods
     */

    deleteAllUsers()
    {
        userModel.remove({}, (err) => {
            if (err) {
                console.log('remove all users failed =', err);
            } else {
                console.log('removed all users successfully');
            }
        });
    }

    deleteAllCounters()
    {
        counterModel.remove({}, (err) => {
            if (err) {
                console.log('remove all counters failed =', err);
            } else {
                console.log('removed all counters successfully');
            }
        })
    }
}

module.exports = Server;
