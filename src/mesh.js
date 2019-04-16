const uuid = require('uuid/v4')
const { Zell, Signal } = require('./model')

class MeshZell extends Zell {
    constructor() {
        super()
        this.channels = []
        this.received = {}
    }

    open(channel) {
        this.channels.push(channel)
        return channel
    }

    receive(signal) {
        signal = JsonMeshSignal.from(signal)

        if (signal.id in this.received)
            return new NullSignal()

        this.received[signal.id] = true

        this.channels.forEach((channel, i) =>
            channel.transmit(signal) || delete this.channels[i])

        return signal
    }

    send(payload) {
        this.receive(new StringSignal(JsonMeshSignal.with(payload).serialized()))
    }
}

class Channel {

    transmit(signal) {
        throw new Error('Not implemented')
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

module.exports = {
    MeshZell,
    Channel,
    StringSignal
}

class NullSignal extends Signal {
    payload() {
        return null
    }
}

class JsonMeshSignal extends Signal {
    constructor(id, payload) {
        super()
        this.id = id
        this._payload = payload
    }

    static with(payload) {
        return new JsonMeshSignal(uuid(), payload)
    }

    static from(signal) {
        const parsed = JSON.parse(signal.payload())
        return new JsonMeshSignal(parsed.id, parsed.payload)
    }

    payload() {
        return this._payload
    }

    serialized() {
        return JSON.stringify({ id: this.id, payload: this.payload() })
    }
}