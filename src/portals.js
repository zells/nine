const { MeshZell } = require('./mesh')

class Portal extends MeshZell {
    constructor(container, channel) {
        super()
        this.channel = channel
        channel.connect(this)

        this.element = $(this.render())
        container.append(this.element)
        this.element.css('position', 'absolute')

        this.element.draggable({ handle: 'header', stack: '.portal' });
        this.element.find('.delete').on('click', this.delete.bind(this))
    }

    delete() {
        this.channel.disconnect(this)
        this.element.remove()
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
        return 'not implemented'
    }
}

class Transceiver extends Portal {
    constructor(container, channel) {
        super(container, channel)

        this.log = this.element.find('.log')

        const send = () => {
            this.send(input[0].value)
            input.focus().select()
        }

        const input = this.element.find('input')
        this.element.find('button').on('click', send)
        input.on('keypress', function (e) {
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
        signal = super.receive(signal)

        this.log.append(`
            <p style="padding-bottom: 0.5em">
                <small class="has-text-grey-light">${new Date().toISOString()}</small>
                ${signal.payload()}
            </p>`)
        this.log.scrollTop(this.log.prop("scrollHeight"))
    }
}

class Channel extends Portal {
    constructor(container, ch) {
        super(container, ch)

        this.log = this.element.find('.log')

        this.channelNames = {}
        this.$channels = this.element.find('.channels')
        this.updateChannels()

        const sender = this.element.find('.sender')
        const message = this.element.find('.msg')

        const send = () => {
            this.send(JSON.stringify({
                channel: this.channelName[0].value,
                sender: sender[0].value,
                message: message[0].value
            }, null, 1))
            message.focus().select()
        }

        this.element.find('button').on('click', send)
        message.on('keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) send()
        });

        this.element.find('.combobox').scombobox({
            empty: true
        })

        this.send('channels?')
    }

    updateChannels() {
        const current = this.channelName ? this.channelName[0].value : null

        this.$channels.html(`
                <select>
                    ${Object.keys(this.channelNames).map(channel => `
                        <option ${channel == current ? 'selected' : ''} value="${channel}">${channel}</option>`)}
                </select>`)
        this.$channels.find('select').scombobox({ empty: !current })
        this.channelName = this.$channels.find('input')
        this.channelName.addClass('input')
        this.channelName.attr('placeholder', 'Channel')
        this.$channels.find('p').css('color', '#2B3E50')
        this.$channels.find('.scombobox').css('margin', '0')
    }

    renderBody() {
        return `
            <div class="channels" style="position: relative">
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
        signal = super.receive(signal)

        if (signal.payload() == 'channels?' && this.channelName[0] && this.channelName[0].value)
            return this.send(JSON.stringify({
                channel: this.channelName[0].value
            }))

        try {

            const message = JSON.parse(signal.payload())

            if (message.channel && !this.channelNames[message.channel]) {
                this.channelNames[message.channel] = true
                this.updateChannels()
            }

            if (!message.message) return

            if (this.channelName[0] && message.channel != this.channelName[0].value) return

            this.log.append(`
                <p style="padding-bottom: 0.5em">
                    <small class="has-text-grey-light" title="${new Date().toISOString()}">${message.sender}</small>
                    ${message.message}
                </p>`)
            this.log.scrollTop(this.log.prop("scrollHeight"))

        } catch {
        }
    }
}

module.exports = {
    Portal,
    portals: {
        Transceiver,
        Channel
    }
}