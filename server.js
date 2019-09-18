const path = require('path')
const express = require('express')
const socket = require('socket.io')
const { Node } = require('./src/mesh')
const { watchServerConnections } = require('./src/websocket')

const port = process.env.PORT || 4242
const staticDir = path.join(__dirname, 'static')

const app = express();

app.use(express.static(staticDir));

const server = app.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`))

watchServerConnections(socket(server), new Node())