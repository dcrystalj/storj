#!/usr/bin/env node

const rread = require('readdir-recursive')
const { promisedSpawn } = require('./src/childProcess')

const Storj = require('./src/storj')
const storj = new Storj(promisedSpawn)

const Args = require('./src/args')
const args = new Args(process.argv)

try {
  if (args.shouldForwardToUplink()) {
    storj.default(args.args).then(() => process.exit(0))
  } else if (args.command === 'cp') {
    args.assertDestinationValid()
    if (process.env.DEBUG) {
      console.log('[VALIDATION] Upload folder is valid')
    }
    const files = rread.fileSync(args.source)
    storj.uploadRecursive(files, args.source, args.destination, args.flags, args.forceReplace).then(() => process.exit(0))
  } else if (args.command === 'rm') {
    if (process.env.DEBUG) {
      console.log('[DELETE] Starting to delete recursive')
    }
    storj.deleteRecursive(args.source, args.flags).then(() => process.exit(0))
  }
} catch (error) {
  console.error(error)
}
