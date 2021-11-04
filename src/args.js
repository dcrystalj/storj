const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')

class Args {
  constructor (args) {
    this.argv = yargs(hideBin(args)).argv
    this.args = args.slice(2)
    this.forceReplace = this._processForceReplace(this.argv)
    this.options = this._createOptions(this.argv)
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

  get prefixedOptions () {
    return this.options.map(o => `--${o}`)
  }

  shouldForwardToUplink = () => {
    return !((this.args.length === 3 && this.command === 'cp' && fs.lstatSync(this.source).isDirectory()) ||
      (this.args.length === 2 && this.command === 'rm'))
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
    return Object.entries(argv).filter(([_, value]) => {
      return value === true
    }).map(([a, _]) => a).filter(a => a !== '')
  }
}

module.exports = Args
