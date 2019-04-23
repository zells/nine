class Zell {

    absorb(signal) {
        throw new Error('Not implemented')
    }

    emit(signal) {
        if (this.emitter) this.emitter(signal)
    }

    emitWith(emitter) {
        this.emitter = emitter
    }

    die() {
        this.dead = true
    }

    isAlive() {
        return !this.dead
    }
}

class Dish {
    constructor() {
        this.culture = []
    }

    put(zell) {
        this.culture.push(zell)
        zell.emitWith(signal => this.emitted(signal, zell))
        return zell
    }

    remove(zell) {
        zell.emitWith(null)
        this.culture = this.culture.filter(z => z != zell)
    }

    emitted(signal, origin) {
        this.disseminate(signal, origin)
    }

    disseminate(signal, origin) {
        const absorbSafely = zell => {
            try {
                zell.absorb(signal)
            } catch (err) {
                console.error(err)
            }
        }

        this.culture = this.culture.filter(zell => zell.isAlive())
        this.culture
            .filter(zell => zell != origin)
            .forEach(absorbSafely)
    }
}

module.exports = {
    Zell,
    Dish
}