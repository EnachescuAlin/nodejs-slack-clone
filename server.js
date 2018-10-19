const express = require('express');

let nr = 0;

class Server
{
    constructor()
    {
        this.server = express();

        this.server.get('/', this.processingGet);
    }

    start(port)
    {
        this.server.listen(port, () => console.log('server started, port =', port));
    }

    processingGet(req, res)
    {
        res.send('Hello world ' + nr);
        nr++;
    }
}

module.exports = Server;
