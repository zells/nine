const { Dish } = require('./model')

class MeshDish extends Dish {
    constructor() {
        super()

        this.channels = []
        this.received = {}
    }

    open(channel) {
        this.channels.push(channel)
        return channel
    }

    emitted(stream, zell) {
        super.emitted(stream, zell)
        this.send(this.pack(stream))
    }

    pack(stream) {
        return new Packet(null, stream)
    }

    send(packet) {
        this.received[packet.id] = Date.now()
        this.channels = this.channels.filter(channel => channel.isOpen())
        this.channels.forEach(channel => channel.transmit(packet))
    }

    receive(packet) {
        if (this._alreadyReceived(packet))
            return

        this.dispense(packet.content)
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

    transmit(packet) { }

    isOpen() {
        return false
    }
}

module.exports = {
    MeshDish,
    Packet,
    Channel,
}