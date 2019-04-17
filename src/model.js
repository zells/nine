class Zell {

    consume(stream) {
    }

    emitWith(emitter) {
        this.emitter = emitter
    }

    emit(stream) {
        if (this.emitter) this.emitter(stream)
    }

    die() {
        this.dead = true
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
        return zell
    }

    remove(zell) {
        zell.emitWith(() => null)
        this.zells = this.zells.filter(z => z != zell)
    }

    emitted(stream, zell) {
        this.dispense(stream, zell)
    }

    dispense(stream, origin) {
        const consumeSafely = zell => {
            try {
                zell.consume(stream)
            } catch (err) {
                console.error(err)
            }
        }

        this.zells = this.zells.filter(zell => !zell.dead)
        this.zells
            .filter(zell => zell != origin)
            .forEach(consumeSafely)
    }
}

module.exports = {
    Zell,
    Stream,
    Dish
}