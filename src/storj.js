const commands = require('./commands')

class Storj {
  constructor (spawn) {
    this.spawn = spawn
  }

  async default (args) {
    if (process.env.DEBUG) {
      console.log('[FALLBACK] Initiating fallback to uplink.')
    }
    await this.spawn([['uplink', args.slice(2)]])
  }

  async uploadRecursive (files, localFolder, uploadFolder, prefixedOptions, forceReplace) {
    for (const localFile of files) {
      const uploadPath = commands.buildUploadPath(localFile, localFolder, uploadFolder)
      if (!forceReplace && (await this._isFileOnServerAlready(uploadPath, prefixedOptions))) {
        if (process.env.DEBUG) {
          console.log(`[SKIPPING] File ${localFile} is on server already.`)
        }
        continue
      }
      if (process.env.DEBUG) {
        console.log(`[UPLOAD] Initiating ${localFile} upload.`)
      }
      await this.spawn([['uplink', ['cp', localFile, uploadPath, ...prefixedOptions]]])
      if (process.env.DEBUG) {
        console.log(`[UPLOAD] Completed uploading ${localFile}`)
      }
    }
  }

  async _isFileOnServerAlready (path, prefixedOptions) {
    try {
      if (process.env.DEBUG) {
        console.log(`[LIST] Checking if ${path} exists on server.`)
      }
      return Boolean(await this.spawn([['uplink', ['ls', path, ...prefixedOptions]]], false))
    } catch (error) {
      return true
    }
  }

  async listRecursivePaths (path, prefixedOptions) {
    if (process.env.DEBUG) {
      console.log(`[LIST] Get recursive files in ${path}`)
    }
    return this.spawn([
      ['uplink', ['ls', path, '--recursive', ...prefixedOptions]],
      ['grep', ['-o', '[^ ]*$']],
    ], false)
  }

  async deleteRecursive (folder, prefixedOptions) {
    let lines = await this.listRecursivePaths(folder, prefixedOptions)
    lines = lines.split('\n').filter(f => f !== '')
    for (const line of lines) {
      const path = commands.buildUploadPath(line, '../', folder)
      if (process.env.DEBUG) {
        console.log(`[DELETE] Deleting ${path}`)
      }
      await this.spawn([['uplink', ['rm', path, ...prefixedOptions]]])
    }
  }
}

module.exports = Storj
