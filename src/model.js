class Zell {

    absorb(signal) {
    }

    wasPutInto(medium) {
        this.medium = medium
    }

    emit(signal) {
        if (this.medium) this.medium.transmit(signal)
    }
}

class Medium {
	
	transmit(signal) {
	}
}

class Dish extends Medium {
    constructor() {
        this.culture = []
    }

    put(zell) {
        if (this.culture.indexOf(zell) > -1) return

        this.culture.push(zell)
        zell.wasPutInto(this)
		
        return zell
    }
	
	remove(zell) {
		zell.wasPutInto(null)
		this.culture = this.culture.filter(z => zell === z)
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