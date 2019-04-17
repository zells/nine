const path = require('path')
const express = require('express')
const { MeshZell } = require('./src/mesh')
const { WebsocketServer } = require('./src/server')

const port = process.env.PORT || 4242
const staticDir = path.join(__dirname, 'static')

const app = express();

app.use(express.static(staticDir));

const server = app.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`))

const mesh = new class extends MeshZell {
    receive(signal) {
        const received = super.receive(signal)
        if (received.payload())
            console.log('mesh::receive', signal.payload())
    }
}

new WebsocketServer(server, mesh)