const path = require('path')
const express = require('express')
const { MeshZell } = require('./src/mesh')
const { WebsocketServerChannel } = require('./src/server')

const port = process.env.PORT || 4242
const staticDir = path.join(__dirname, 'static')

const app = express();

app.use(express.static(staticDir));

const server = app.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`))

new WebsocketServerChannel(server, new MeshZell())