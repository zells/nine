const { Zell, Signal } = require('./model')
const { MeshZell, Channel, StringSignal } = require('./mesh')
const { Portal, portals } = require('./portals')

class WebsocketClient {
    constructor(socket, mesh) {
        socket.on('connect', () => mesh.open(new WebsocketChannel(socket)))
        socket.on('signal', string => mesh.receive(new StringSignal(string)))
    }
}

class WebsocketChannel extends Channel {
    constructor(socket) {
        super()
        this.open = true
        this.socket = socket

        socket.on('disconnect', () => this.open = false)
    }

    transmit(signal) {
        socket.emit('signal', signal.serialized())
    }

    isOpen() {
        return this.open
    }
}

window.z = {
    Zell,
    Signal,
    MeshZell,
    Channel,
    Portal,
    portals,
    WebsocketClient
}