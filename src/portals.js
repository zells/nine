const { Zell } = require('./model')
const { Channel } = require('./mesh')

class Portal extends Zell {
    constructor(container, mesh) {
        super()
        this.mesh = mesh
        this.channel = mesh.open(new PortalChannel(this))

        this.$element = $(this.render())
        this.$element.css('position', 'absolute')
        this.$element.draggable({ handle: 'header', stack: '.portal' });
        this.$element.find('.delete').on('click', this.delete.bind(this))

        container.append(this.$element)
    }

    send(payload) {
        this.mesh.send(payload)
    }

    delete() {
        this.channel.close()
        this.$element.remove()
    }

    render() {
        return `
            <div class="portal card">
                <header class="card-header">
                    <p class="card-header-title">
                        ${this.constructor.name}
                    </p>
                    <div href="#" class="card-header-icon">
                        <a class="delete"></a>
                    </div>
                </header>
                <div class="body card-content">
                    ${this.renderBody()}
                </div>
            </div>`
    }

    renderBody() {
        throw new Error('Not implemented')
    }
}

class PortalChannel extends Channel {
    constructor(portal) {
        super()
        this.open = true
        this.portal = portal
    }

    transmit(signal) {
        try {
            this.portal.receive(signal)
        } catch (err) {
            console.error(err)
        }
    }

    isOpen() {
        return this.open
    }

    close() {
        this.open = false
    }
}

class Transceiver extends Portal {
    constructor(container, mesh) {
        super(container, mesh)

        this.$log = this.$element.find('.log')

        const $input = this.$element.find('input')
        const send = () => {
            this.send($input[0].value)
            $input.focus().select()
        }

        this.$element.find('button').on('click', send)
        $input.on('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) send()
        });
    }

    renderBody() {
        return `
            <div class="log" style="height: 200px; overflow: auto"></div>

            <div class="columns is-gapless">
                <div class="column">
                    <input class="input" type="text" placeholder="Content">
                </div>
                <div class="column is-3">
                    <button class="button is-link" style="width: 100%">send</button>
                </div>
            </div>`
    }

    receive(signal) {
        this.$log.append(`
            <p style="padding-bottom: 0.5em">
                <small class="has-text-grey-light">${new Date().toISOString()}</small>
                ${signal.payload()}
            </p>`)
        this.$log.scrollTop(this.$log.prop("scrollHeight"))
    }
}

class ChatRoom extends Portal {
    constructor(container, mesh) {
        super(container, mesh)
        this.rooms = {}

        this.$log = this.$element.find('.log')

        this.$rooms = this.$element.find('.rooms')
        this.updateRooms()

        const $sender = this.$element.find('.sender')
        const $message = this.$element.find('.msg')

        const send = () => {
            this.send(JSON.stringify({
                room: this.$room[0].value,
                sender: $sender[0].value,
                message: $message[0].value
            }, null, 1))
            $message.focus().select()
        }

        this.$element.find('button').on('click', send)
        $message.on('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) send()
        });

        this.$element.find('.combobox').scombobox({
            empty: true
        })

        this.send('rooms?')
    }

    updateRooms() {
        const current = this.$room ? this.$room[0].value : null

        this.$rooms.html(`
                <select>
                    ${Object.keys(this.rooms).map(room => `
                        <option ${room == current ? 'selected' : ''} value="${room}">${room}</option>`)}
                </select>`)

        this.$rooms.find('select').scombobox({ empty: !current })

        this.$rooms.find('p').css('color', '#2B3E50')
        this.$rooms.find('.scombobox').css('margin', '0')

        this.$room = this.$rooms.find('input')
        this.$room.addClass('input')
        this.$room.attr('placeholder', 'Room')
    }

    renderBody() {
        return `
            <div class="rooms" style="position: relative">
            </div>

            <input class="sender input" type="text" placeholder="Sender">

            <div class="log" style="height: 200px; overflow: auto"></div>

            <div class="columns is-gapless">
                <div class="column">
                    <input class="msg message input" type="text" placeholder="Content">
                </div>
                <div class="column is-3">
                    <button class="button is-link" style="width: 100%">send</button>
                </div>
            </div>`
    }

    receive(signal) {
        if (signal.payload() == 'rooms?' && this.$room[0] && this.$room[0].value)
            return this.send(JSON.stringify({
                room: this.$room[0].value
            }))

        try {

            const message = JSON.parse(signal.payload())

            if (message.room && !this.rooms[message.room]) {
                this.rooms[message.room] = true
                this.updateRooms()
            }

            if (!message.message) return

            if (this.$room[0] && message.room != this.$room[0].value) return

            this.$log.append(`
                <p style="padding-bottom: 0.5em">
                    <small class="has-text-grey-light" title="${new Date().toISOString()}">${message.sender}</small>
                    ${message.message}
                </p>`)
            this.$log.scrollTop(this.$log.prop("scrollHeight"))

        } catch {
        }
    }
}

module.exports = {
    Portal,
    portals: {
        Transceiver,
        ChatRoom
    }
}