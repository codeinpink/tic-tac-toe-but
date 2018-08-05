
export class Option {
  constructor (value) {
    this.value = value
  }

  forEach (lambda) {
    if (this.isDefined()) {
      lambda(this.value)
    }
  }

  get () {
    if (this.isDefined()) {
      return this.value
    } else {
      throw new Error('Tried to get value of empty option')
    }
  }

  map (lambda) {
    if (this.isDefined()) {
      return new Option(lambda(this.value))
    } else {
      return none
    }
  }

  isDefined () {
    return this.value !== undefined
  }
}

export const none = new Option()
export const some = (val) => new Option(val)
