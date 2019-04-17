const uuid = require('uuid/v4')
const { Zell } = require('./model')
const { MeshDish, Packet } = require('./mesh')
const { WebsocketChannel } = require('./server')
const { portals } = require('./portals')

class WebsocketClientDish extends MeshDish {
    constructor(socket) {
        super()

        socket.on('connect', () => this.open(new WebsocketChannel(socket, this)))
    }

    pack(stream) {
        return new Packet(uuid(), stream)
    }
}

window.z = {
    Zell,
    portals,
    WebsocketClientDish
}