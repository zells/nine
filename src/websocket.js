const { Node, Channel, Packet } = require('./mesh')

class WebsocketServerNode extends Node {
    constructor(socket) {
        super()

        socket.on('connection', client => this.open(new WebsocketChannel(client, this)))
    }
}

class WebsocketClientNode extends Node {
    constructor(socket) {
        super()

        socket.on('connect', () => this.open(new WebsocketChannel(socket, this)))
    }
}

class WebsocketChannel extends Channel {
    constructor(socket, node) {
        super()
        console.log('WebsocketChannel', socket.id)

        this.socket = socket

        socket.on('signal', data => node.receive(this._inflate(data)))
        socket.on('disconnect', () => this.close())
    }

    deliver(packet) {
        if (!this.isOpen()) return
        
        this.socket.emit('signal', this._deflate(packet))
    }

    _inflate(data) {
        const parsed = JSON.parse(data)
        return new Packet(parsed.id, parsed.content)
    }

    _deflate(packet) {
        return JSON.stringify({
            id: packet.id,
            content: packet.content.toString()
        })
    }
}

module.exports = {
    WebsocketServerNode,
    WebsocketClientNode,
    WebsocketChannel
}