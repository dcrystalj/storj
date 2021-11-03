#!/usr/bin/env node

const rread = require('readdir-recursive')
const { promisedSpawn } = require('./src/childProcess')

const Storj = require('./src/storj')
const storj = new Storj(promisedSpawn)

const Args = require('./src/args')
const args = new Args(process.argv)

if (args.shouldForwardToUplink()) {
  storj.default(args.args).then(() => process.exit(0))
} else {
  args.assertUploadFolderValid()
  if (process.env.DEBUG) {
    console.log('[VALIDATION] Upload folder is valid')
  }
  const files = rread.fileSync(args.localFolder)
  storj.uploadRecursive(files, args.localFolder, args.uploadFolder, args.prefixedOptions, args.forceReplace).then(() => process.exit(0))
}
