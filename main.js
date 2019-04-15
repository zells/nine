const path = require('path');
const {startServer, WebsocketServerMesh} = require('./src/server')

const port = process.env.PORT || 4242;
const staticDir = path.join(__dirname, 'static');

const node = new WebsocketServerMesh(startServer(port, staticDir))