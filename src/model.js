class Zell {

    consume(stream) {
    }

    emitWith(emitter) {
        this.emitter = emitter
    }

    emit(stream) {
        if (this.emitter) this.emitter(stream)
    }

    dieWith(killer) {
        this.killer = killer
    }

    die() {
        if (this.killer) this.killer()
    }
}

class Stream {

    all() {
        return new Buffer(0)
    }

    toString() {
        return this.all().toString()
    }

    next() {
        return 0
    }

    hasNext() {
        return false
    }
}

class Dish {
    constructor() {
        this.zells = []
    }

    put(zell) {
        this.zells.push(zell)
        zell.emitWith(stream => this.emitted(stream, zell))
        zell.dieWith(() => this.remove(zell))
        return zell
    }

    remove(zell) {
        this.zells = this.zells.filter(z => z != zell)
    }

    emitted(stream, zell) {
        this.dispense(stream, zell)
    }

    dispense(stream, origin) {
        this.zells.forEach(zell => {
            if (zell == origin) return

            try {
                zell.consume(stream)
            } catch (err) {
                console.error(err)
            }
        })
    }
}

module.exports = {
    Zell,
    Stream,
    Dish
}