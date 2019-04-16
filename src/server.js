const socket = require('socket.io')
const { Signal } = require('./model')
const { Channel } = require('./mesh')

class WebsocketServerChannel extends Channel {
    constructor(server, mesh) {
        super()

        this.mesh = mesh

        const io = socket(server);
        io.on('connection', client => {
            console.log('socket::connection', client.id)

            client.on('signal', string => this.transmit(new StringSignal(string)))
            
            mesh.open(new ClientChannel(client))
        })
    }

    transmit(signal) {
        this.mesh.receive(signal)
        return true
    }
}

module.exports = {
    WebsocketServerChannel
}

class ClientChannel extends Channel {
    constructor(client) {
        super()
        this.client = client
        this.open = true

        client.on('disconnect', () => this.open = false)
    }

    transmit(signal) {
        if (!this.open) return false

        this.client.emit('signal', signal.serialized())
        return true
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