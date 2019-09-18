
const { Link, Packet } = require('./mesh')

class WebsocketLink extends Link {

    constructor(socket, node) {
        super()
        console.log('WebsocketLink', socket.id)

        this.socket = socket
        this.broken = false

        socket.on('signal', data => node.receive(this._inflate(data)))
        socket.on('disconnect', () => this.broken = true)
    }

    transport(packet) {
        if (this.isBroken()) return
        this.socket.emit('signal', this._deflate(packet))
    }

    isBroken() {
        return this.broken
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

function watchServerConnections(socket, node) {
    socket.on('connection', client => node.attach(new WebsocketLink(client, node)))
}

function watchClientConnections(socket, node) {
    socket.on('connect', () => node.attach(new WebsocketLink(socket, node)))
}

module.exports = {
    watchServerConnections,
    watchClientConnections
}