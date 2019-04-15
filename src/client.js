const { Node, Mesh, Signal } = require('./model')
const { Portal, portals } = require('./portals')

class WebsocketClientMesh extends Mesh {
    constructor(socket) {
        super()
        socket.on('signal', this.receive.bind(this))
        this.link(new WebscoketSocketNode(socket))
    }
}

class WebscoketSocketNode extends Node {
    constructor(socket) {
        super()
        this.socket = socket
    }

    receive(stream) {
        socket.emit('signal', stream)
    }
}

window.zmesh = {
    Node,
    Mesh,
    Signal,
    WebsocketClientMesh,
    Portal,
    portals
}