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

    send(payload) {
        try {
            this.receive(new StringSignal(JsonMeshSignal.with(payload).serialized()))
        } catch (err) {
            console.error(err)
        }
    }

    receive(signal) {
        return this._receiveMesh(this._parseMesh(signal))
    }

    _parseMesh(signal) {
        return JsonMeshSignal.from(signal)
    }

    _receiveMesh(signal) {
        if (this._alreadyReceived(signal)) return new NullSignal()
        this._emit(signal)
        return signal
    }

    _alreadyReceived(signal) {
        if (signal.id in this.received) return true
        this.received[signal.id] = Date.now()
        return false
    }

    _emit(signal) {
        this.channels.forEach((channel, i) =>
            channel.isOpen()
                ? channel.transmit(signal)
                : delete this.channels[i])
    }
}

class Channel {

    transmit(signal) {
        throw new Error('Not implemented')
    }

    isOpen() {
        return false
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

class MeshSignal extends Signal {
    constructor(id, payload) {
        super()
        this.id = id
        this._payload = payload
    }

    payload() {
        return this._payload
    }
}

class JsonMeshSignal extends MeshSignal {

    static with(payload) {
        return new JsonMeshSignal(uuid(), payload)
    }

    static from(signal) {
        const parsed = JSON.parse(signal.payload())
        return new JsonMeshSignal(parsed.id, parsed.payload)
    }

    serialized() {
        return JSON.stringify({ id: this.id, payload: this.payload() })
    }
}