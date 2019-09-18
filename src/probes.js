const { Zell } = require('./model')

class Probe extends Zell {
    constructor(node, container) {
        super()
		this.node = node

        this.$element = $(this.render())
        this.$element.css('position', 'absolute')
        this.$element.draggable({ handle: 'header', stack: '.probe' })
        this.$element.find('.delete').on('click', () => this.close())

        container.append(this.$element)
    }

    close() {
        this.node.remove(this)
        this.$element.remove()
    }

    render() {
        return `
            <div class="probe card">
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
        return '<strong>Empty Probe</strong>'
    }
}

class Receiver extends Probe {
    constructor(node, container) {
        super(node, container)

        this.$log = this.$element.find('.log')
    }

    renderBody() {
        return `
            <div class="log" style="height: 200px; overflow: auto"></div>`
    }

    absorb(signal) {
        this.$log.append(`
            <p style="padding-bottom: 0.5em">
                <small class="has-text-grey-light">${new Date().toISOString()}</small>
                ${signal.toString()}
            </p>`)
        this.$log.scrollTop(this.$log.prop("scrollHeight"))
    }
}

class Sender extends Probe {
    constructor(node, container) {
        super(node, container)

        const $input = this.$element.find('input')
        const send = () => {
            this.emit($input[0].value)
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
            <div class="columns is-gapless">
                <div class="column">
                    <input class="input" type="text" placeholder="Content">
                </div>
                <div class="column is-3">
                    <button class="button is-link" style="width: 100%">send</button>
                </div>
            </div>`
    }
}

class ChatRoom extends Probe {
    constructor(node, container) {
        super(node, container)

        this.rooms = {}

        this.$log = this.$element.find('.log')

        this.$rooms = this.$element.find('.rooms')
        this.updateRooms()

        const $sender = this.$element.find('.sender')
        const $message = this.$element.find('.msg')

        const send = () => {
            this.emit(JSON.stringify({
                room: this.$room[0].value,
                sender: $sender[0].value,
                message: $message[0].value
            }, null, 1))
            $message[0].value = ''
            $message.focus()
        }

        this.$element.find('button').on('click', send)
        $message.on('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) send()
        });

        this.$element.find('.combobox').scombobox({
            empty: true
        })
    }

    wasPutInto(medium) {
        super.wasPutInto(medium)
        this.emit('rooms?')
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
            <div class="rooms" style="position: relative"></div>

            <input class="sender input" type="text" placeholder="Your name">

            <div class="log" style="height: 200px; overflow: auto"></div>

            <div class="columns is-gapless">
                <div class="column">
                    <input class="msg message input" type="text" placeholder="Your message">
                </div>
                <div class="column is-3">
                    <button class="button is-link" style="width: 100%">send</button>
                </div>
            </div>`
    }

    absorb(signal) {
        if (signal.toString() == 'rooms?') {
            if (this.$room[0] && this.$room[0].value) {
                this.emit(JSON.stringify({
                    room: this.$room[0].value
                }))
            }
            return
        }

        let said
        try {
            said = JSON.parse(signal.toString())
        } catch (ignored) {
            // Not a ChatRoom message
            return
        }

        if (said.room && !this.rooms[said.room]) {
            this.rooms[said.room] = true
            this.updateRooms()
        }

        if (!said.message) return

        if (this.$room[0] && said.room != this.$room[0].value) return

        const classes = (said.sender == this.$element.find('.sender')[0].value)
            ? { sender: 'has-text-grey', message: 'has-text-grey-light' }
            : { sender: 'has-text-grey-light', message: '' }

        this.$log.append(`
            <p style="padding-bottom: 0.5em">
                <small class="${classes.sender}" title="${new Date().toISOString()}">${said.sender}</small>
                <span class="${classes.message}">${said.message}</span>
            </p>`)

        this.$log.scrollTop(this.$log.prop("scrollHeight"))
    }
}

module.exports = {
    Probe,
    probes: {
        Receiver,
        Sender,
        ChatRoom
    }
}