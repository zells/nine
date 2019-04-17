const uuid = require('uuid/v4')
const { MeshDish, Channel, Packet } = require('./mesh')

class WebsocketServerDish extends MeshDish {
    constructor(socket) {
        super()

        socket.on('connection', client => this.open(new WebsocketChannel(client, this)))
    }

    pack(stream) {
        return new Packet(uuid(), stream)
    }
}

class WebsocketChannel extends Channel {
    constructor(socket, dish) {
        super()

        this.socket = socket
        this.open = true

        socket.on('signal', data => dish.receive(this._inflate(data)))
        socket.on('disconnect', () => this.open = false)
    }

    transmit(packet) {
        this.socket.emit('signal', this._deflate(packet))
    }

    isOpen() {
        return this.open
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
    WebsocketServerDish,
    WebsocketChannel
}