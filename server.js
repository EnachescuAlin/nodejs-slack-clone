const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userModel = require('./userModel');

class Server
{
    constructor()
    {
        mongoose.connect('mongodb://localhost/slack_clone_db', (err) => {
            if (err) {
                console.log('connect to database failed =', err);
            } else {
                console.log('connected to database successfully');
            }
        });

        this.server = express(http);
        this.server.use(express.json());

        this.server.get('/', this.processingGet);
        this.server.get('/users', this.handleGetUsers);

        this.server.post('/signUp', this.handleSignUp);
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
        console.log('handle sign up, username =', username, ', password =', password);

        userModel.findOne({ 'username': username }, (err, user) => {
            if (err) {
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

            newUser.save((err, user) => {
                if (err) {
                    res.send({ 'error': 'could not save user' });
                    return;
                }

                res.send({ 'error': 'ok' });
            });
        });
    }

    handleGetUsers(req, res)
    {
        console.log('handle get users');
        userModel.find((err, users) => {
            if (err) {
                res.send({ 'error': 'could not get users' });
                return;
            }

            res.send(users);
        });
    }
}

module.exports = Server;
