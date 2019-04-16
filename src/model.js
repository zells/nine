class Zell {

    receive(signal) {
        throw new Error('Not implemented')
    }
}

class Signal {

    payload() {
        throw new Error('Not implemented')
    }

    serialized() {
        throw new Error('Not implemented')
    }
}

module.exports = { Zell, Signal }