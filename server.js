const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

class Server
{
    constructor()
    {
        this.server = express(http);
        this.server.use(express.json());

        this.server.get('/', this.processingGet);

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
        console.log('handle sign up, body =', req.body);
        res.send(req.body);
    }
}

module.exports = Server;
