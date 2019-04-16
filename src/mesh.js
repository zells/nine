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

        this.emit(signal)

        return signal
    }

    send(payload) {
        this.emit(JsonMeshSignal.with(payload))
    }

    emit(signal) {
        this.channels.forEach((channel, i) =>
            channel.transmit(signal) || delete this.channels[i])
    }
}

class Channel {

    transmit(signal) {
        return false
    }
}

module.exports = {
    MeshZell,
    Channel
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