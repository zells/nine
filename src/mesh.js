const { Dish } = require('./model')

class Node extends Dish {
    constructor() {
        super()

        this.links = []
        this.received = {}
    }

    attach(link) {
        this.links.push(link)
        return link
    }

    transmit(signal) {
        super.transmit(signal)
        this.send(this.pack(signal))
    }

    pack(signal) {
        return new Packet(Math.random(), signal)
    }

    send(packet) {
        this.received[packet.id] = Date.now()
        this.links = this.links.filter(link => {
			if (link.isBroken()) return false
			
			link.transport(packet)
			return true
		})
    }

    receive(packet) {
        console.log('receive', { packet })
        if (this._alreadyReceived(packet)) return

        this.disseminate(packet.content)
        this.send(packet)
    }

    _alreadyReceived(packet) {
        if (packet.id in this.received) return true

        this.received[packet.id] = Date.now()
        return false
    }
}

class Packet {
    constructor(id, content) {
        this.id = id
        this.content = content
    }
}

class Link {

    transport(packet) {
    }

    isBroken() {
        return true
    }
}

module.exports = {
    Node,
    Packet,
    Link,
}