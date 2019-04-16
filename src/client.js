const { Zell, Signal } = require('./model')
const { MeshZell, Channel } = require('./mesh')
const { Portal, portals } = require('./portals')

class WebsocketChannel extends Channel {
    constructor(socket) {
        super()
        this.socket = socket
        this.zells = []
        
        socket.on('signal', string => this.transmit(new StringSignal(string)))
    }

    connect(mesh) {
        this.zells.push(mesh)
        mesh.open(new SocketChannel(this.socket))
    }

    disconnect(mesh) {
        delete this.zells[this.zells.indexOf(mesh)]
    }

    transmit(signal) {
        this.zells.forEach(zell => zell.receive(signal))
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

class SocketChannel extends Channel {
    constructor(socket) {
        super()
        this.socket = socket

        socket.on('connect', () => this.connected = true)
        socket.on('disconnect', () => this.connected = false)
    }

    transmit(signal) {
        if (!this.connected) return true

        socket.emit('signal', signal.serialized())
        return true
    }
}

class StringSignal extends Signal {
    constructor(string) {
        super()
        this.string = string
    }

    payload() {
        return this.string
    }

    serialized() {
        return this.payload()
    }
}