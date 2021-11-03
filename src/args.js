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

  get localFolder () {
    return this.argv._[1].toString()
  }

  get uploadFolder () {
    return this.argv._[2].toString()
  }

  get prefixedOptions () {
    return this.options.map(o => `--${o}`)
  }

  shouldForwardToUplink = () => {
    return this.argv._.length !== 3 || this.command !== 'cp' || !fs.lstatSync(this.localFolder).isDirectory()
  }

  assertUploadFolderValid = () => {
    if (!this.uploadFolder.startsWith('sj://')) {
      console.error('Use upload format sj://...')
      process.exit(1)
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
