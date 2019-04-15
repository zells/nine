const uuid = require('uuid/v4')

class Signal {
    constructor(content) {
        this.content = content;
    }

    toFrame() {
        throw new Error('Implementation missing')
    }
}

const parse = stream => {
    return JsonSignal.fromFrame(stream)
}

class JsonSignal extends Signal {
    constructor(content) {
        super(content)
        this.id = uuid();
    }

    toFrame() {
        return { id: this.id, content: this.content }
    }

    static fromFrame(frame) {
        const signal = new JsonSignal(frame.content)
        signal.id = frame.id
        return signal
    }
}

module.exports = {
    parse,
    DefaultSignal: JsonSignal,
    JsonSignal
}