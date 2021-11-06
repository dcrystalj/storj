const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')

const FLAGS = {
  GLOBAL: new Set(['advanced', 'config-dir']),
  LS: new Set(['access', 'encrypted', 'x', 'expanded', 'h', 'help', 'pending', 'recursive']),
  CP: new Set(['access', 'expires', 'metadata', 'parallelism', 'h', 'help', 'progress']),
  RM: new Set(['access', 'encrypted', 'pending', 'h', 'help']),
}

class Flags {
  constructor (options) {
    for (const c of ['ls', 'cp', 'rm']) {
      const built = Flags.build(FLAGS[c.toUpperCase()], options)
      this[`${c}Options`] = built
      this[c] = Flags.serialize(built)
    }
  }

  static build (commanFlags, options) {
    return Object.fromEntries(Object.entries(options).filter(([k, v]) => commanFlags.has(k) || FLAGS.GLOBAL.has(k)))
  }

  static serialize (options) {
    const result = []
    Object.entries(options).forEach(([key, value]) => {
      result.push(`${key.length === 1 ? '-' : '--'}${key}`)
      if (value !== true) {
        result.push(value.toString())
      }
    })
    return result
  }
}

class Args {
  constructor (args) {
    this.argv = yargs(hideBin(args)).argv
    this.args = args.slice(2)
    this.forceReplace = this._processForceReplace(this.argv)
    this.options = this._createOptions(this.argv)
    this.flags = new Flags(this.options)
  }

  get command () {
    return this.argv._[0].toString()
  }

  get source () {
    return this.argv._[1].toString()
  }

  get destination () {
    return this.argv._[2].toString()
  }

  shouldForwardToUplink = () => {
    return !(
      (this.args.length >= 3 && this.command === 'cp' && fs.lstatSync(this.source).isDirectory()) ||
      (this.args.length >= 2 && this.command === 'rm')
    )
  }

  assertDestinationValid = () => {
    if (!this.destination.startsWith('sj://')) {
      throw new Error('Use upload format sj://...')
    }
  }

  /**
   * Special args for forcing cp
   */
  _processForceReplace (argv) {
    if (argv.forceReplace) {
      delete argv.forceReplace
      return true
    }
    return false
  }

  _createOptions (argv) {
    const options = { ...argv }
    delete options._
    delete options.$0
    return options
  }
}

module.exports = Args
