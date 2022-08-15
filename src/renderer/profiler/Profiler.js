class Profiler {
  constructor() {
    this.records = {}
  }
  /**
   *
   * @param {*} key
   * @param {*} options
   * @param {Number} options.interval
   * @param {String} options.extraText
   */
  start(key, options) {
    if (this.records[key]) {
      this.records[key].start = new Date().getTime()
      this.records[key].extraText = options.extraText
      this.records[key].times++
      return
    }

    this.records[key] = {
      start: new Date().getTime(),
      interval: options.interval,
      extraText: options.extraText
    }
    this.records[key].times = this.records[key].times || 0
    this.records[key].times++
  }
  end(key) {
    if (this.records[key]) {
      if (this.records[key].interval) {
        if (this.records[key].times % this.records[key].interval !== 0) return
      }
      console.log(`${key}:${new Date().getTime() - this.records[key].start},${this.records[key].extraText}`)
      delete this.records[key]
    }
  }
}

export default Profiler
