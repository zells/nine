const { Zell, Signal } = require('./model')
const { MeshZell, Channel, StringSignal } = require('./mesh')
const { Portal, portals } = require('./portals')

class WebsocketChannel extends Channel {
    constructor(socket) {
        super()
        this.socket = socket

        socket.on('connect', () => this.connected = true)
        socket.on('disconnect', () => this.connected = false)
    }

    connect(zell) {
        socket.on('signal', string => zell.receive(new StringSignal(string)))
        return this
    }

    transmit(signal) {
        if (!this.connected) return true

        socket.emit('signal', signal.serialized())
        return true
    }
}

window.z = {
    Zell,
    Signal,
    MeshZell,
    Channel,
    Portal,
    portals,
    WebsocketChannel
}