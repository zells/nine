const express = require('express');
const socket = require('socket.io')
const { Node, Mesh } = require('./model')

const startServer = (port, staticDir) => {
    const app = express();

    app.use(express.static(staticDir));

    return app.listen(port, () =>
        console.log(`Listening on http://localhost:${port}`)
    )
}

class WebsocketServerMesh extends Mesh {
    constructor(server) {
        super()

        const io = socket(server);
        io.on('connection', client => {
            console.log('socket::connection', client.id)
            
            const link = this.link(new ClientNode(client))
            client.on('disconnect', () => this.unlink(link))

            client.on('signal', stream => this.receive(stream))
        })
    }

    receiveContent(content) {
        console.log('received', content)
    }
}

class ClientNode extends Node {
    constructor(client) {
        super()
        this.client = client
    }

    receive(stream) {
        this.client.emit('signal', stream)
    }
}

module.exports = {
    startServer,
    WebsocketServerMesh
}