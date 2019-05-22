class Zell {

    absorb(signal) {
    }

    putInto(dish) {
        if (this.dish === dish) return
        if (this.dish) this.dish.remove(this)

        this.dish = dish
        if (dish) dish.put(this)
    }

    emit(signal) {
        if (this.dish) this.dish.transmit(signal)
    }

    die() {
        if (this.dish) this.dish.remove(this)
    }
}

class Dish {
    constructor() {
        this.culture = []
    }

    put(zell) {
        if (this.culture.indexOf(zell) > -1) return

        this.culture.push(zell)
        zell.putInto(this)
        return zell
    }

    remove(zell) {
        zell.putInto(null)
        this.culture = this.culture.filter(z => z != zell)
    }

    transmit(signal) {
        this.disseminate(signal)
    }

    disseminate(signal) {
        this.culture.forEach(zell => {
            try {
                zell.absorb(signal)
            } catch (err) {
                console.error(err)
            }
        })
    }
}

module.exports = {
    Zell,
    Dish
}