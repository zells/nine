const uuid = require('uuid/v4')
const { Dish } = require('./model')

class Node extends Dish {
    constructor() {
        super()

        this.links = []
        this.received = {}
    }

    attach(link) {
        this.links.push(link)
    }

    transmit(signal) {
        super.transmit(signal)
        this.send(new Packet(uuid(), signal))
    }

    send(packet) {
        this.received[packet.id] = Date.now()
        this.purgeBrokenLinks()
        this.links.forEach(link => link.transport(packet))
    }

    purgeBrokenLinks() {
        this.links = this.links.filter(link => !link.isBroken())
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