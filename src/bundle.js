const { Zell } = require('./model')
const { portals } = require('./portals')
const { WebsocketClientNode } = require('./websocket')

window.z = {
    Zell,
    portals,
    WebsocketClientNode
}