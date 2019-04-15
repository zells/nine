const signals = require('./signals')

class Node {
    receive(stream) { }
}

class Mesh extends Node {
    constructor() {
        super()
        this.links = {}
        this.received = {}
    }

    receive(stream) {
        this.receiveSignal(signals.parse(stream))
    }

    receiveSignal(signal) {
        if (signal.id in this.received) return
        this.received[signal.id] = true

        Object.values(this.links).forEach(link => link.receive(signal.toFrame()))

        this.receiveContent(signal.content)
    }

    receiveContent(content) { }

    send(content) {
        this.receiveSignal(new signals.DefaultSignal(content))
    }

    link(node) {
        const key = Math.max(...Object.keys(this.links), 0) + 1
        this.links[key] = node
        return key
    }

    unlink(key) {
        delete this.links[key]
    }
}

module.exports = { Node, Mesh }