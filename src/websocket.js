const uuid = require('uuid/v4')
const { Node, Link, Packet } = require('./mesh')

class WebsocketNode extends Node {
	
	connectTo(socket) {
		this.attach(new WebsocketLink(socket, this)
	}

    pack(signal) {
        return new Packet(uuid(), signal)
    }
}

class WebsocketServerNode extends WebsocketNode {
    constructor(socket) {
        super()
        socket.on('connection', client => this.connectTo(client))
    }
}

class WebsocketClientNode extends WebsocketNode {
    constructor(socket) {
        super()
        socket.on('connect', () => this.connectTo(socket))
    }
}

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

module.exports = {
    WebsocketServerNode,
    WebsocketClientNode
}