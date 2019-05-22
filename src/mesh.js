const uuid = require('uuid/v4')
const { Dish } = require('./model')

class Node extends Dish {
    constructor() {
        super()

        this.channels = []
        this.received = {}
    }

    open(channel) {
        this.channels.push(channel)
        return channel
    }

    transmit(signal) {
        super.transmit(signal)
        this.send(this.pack(signal))
    }

    pack(signal) {
        return new Packet(uuid(), signal)
    }

    send(packet) {
        this.received[packet.id] = Date.now()
        this.channels = this.channels.filter(channel => channel.isOpen())
        this.channels.forEach(channel => channel.deliver(packet))
    }

    receive(packet) {
        console.log('receive', { packet })
        if (this._alreadyReceived(packet))
            return

        this.disseminate(packet.content)
        this.send(packet)
    }

    _alreadyReceived(packet) {
        if (packet.id in this.received)
            return true

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

class Channel {

    deliver(packet) {
        throw new Error('Not implemented')
    }

    close() {
        this.closed = true
    }

    isOpen() {
        return !this.closed
    }
}

module.exports = {
    Node,
    Packet,
    Channel,
}