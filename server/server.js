const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const counterModel = require('./countersModel');
const errorHandler = require('./errorHandler');

async function init()
{
    await mongoose.set('useCreateIndex', true)
    await mongoose.connect('mongodb://localhost/slack_clone_db', { useNewUrlParser: true }, (err) => {
        if (err) {
            console.log('connect to database failed =', err);
        } else {
            console.log('connected to database successfully');
        }
    });

    await counterModel.findOne({ 'name': 'userId'}, (err, counter) => {
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

init();

const app = express(http);

app.use(express.json());

// api routes
app.use('/users', require('./users.controller'));
app.use('/debug', require('./debug.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
