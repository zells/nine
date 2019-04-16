const socket = require('socket.io')
const { Channel, StringSignal } = require('./mesh')

class WebsocketServer extends Channel {
    constructor(server, mesh) {
        super()

        const io = socket(server);
        io.on('connection', client => {
            console.log('socket::connection', client.id)

            mesh.open(new ClientChannel(client))
            client.on('signal', string => mesh.receive(new StringSignal(string)))
        })
    }
}

module.exports = {
    WebsocketServer
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