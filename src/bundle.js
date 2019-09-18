const { Node } = require('./mesh')
const { probes } = require('./probes')
const websocket = require('./websocket')

window.z = {
    Node,
    probes,
    websocket
}