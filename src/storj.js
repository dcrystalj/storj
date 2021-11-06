const commands = require('./commands')

class Storj {
  constructor (spawn) {
    this.spawn = spawn
  }

  async default (args) {
    if (process.env.DEBUG) {
      console.log('[FALLBACK] Initiating fallback to uplink.')
    }
    await this.spawn.chained([['uplink', args]])
  }

  async uploadRecursive (files, localFolder, uploadFolder, flags, forceReplace) {
    for (const localFile of files) {
      const uploadPath = commands.buildUploadPath(localFile, localFolder, uploadFolder)
      if (!forceReplace && (await this._isFileOnServerAlready(uploadPath, flags))) {
        if (process.env.DEBUG) {
          console.log(`[SKIPPING] File ${localFile} is on server already.`)
        }
        continue
      }
      if (process.env.DEBUG) {
        console.log(`[UPLOAD] Initiating ${localFile} upload.`)
      }
      await this.spawn.chained([['uplink', ['cp', localFile, uploadPath, ...flags.cp]]])
      if (process.env.DEBUG) {
        console.log(`[UPLOAD] Completed uploading ${localFile}`)
      }
    }
  }

  async _isFileOnServerAlready (path, flags) {
    try {
      if (process.env.DEBUG) {
        console.log(`[LIST] Checking if ${path} exists on server.`)
      }
      const output = await await this.spawn.chainedWithOutput([['uplink', ['ls', path, ...flags.ls]]])
      return Boolean(output)
    } catch (error) {
      return true
    }
  }

  async listRecursivePaths (path, flags) {
    if (process.env.DEBUG) {
      console.log(`[LIST] Get recursive files in ${path}`)
    }
    return this.spawn.chainedWithOutput([
      ['uplink', ['ls', path, '--recursive', ...flags.ls]],
      ['grep', ['-o', '[^ ]*$']],
    ])
  }

  async deleteRecursive (folder, flags) {
    let lines = await this.listRecursivePaths(folder, flags)
    lines = lines.split('\n').filter(f => f !== '')
    for (const line of lines) {
      const path = commands.buildUploadPath(line, '../', folder)
      if (process.env.DEBUG) {
        console.log(`[DELETE] Deleting ${path}`)
      }
      await this.spawn.chained([['uplink', ['rm', path, ...flags.rm]]])
    }
  }
}

module.exports = Storj
