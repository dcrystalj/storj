const childProcess = require('child_process')

/**
 * Spawn new process and redirect its output to this process output.
 * Resolve promise on finished
 */
const promisedSpawn = (command, args, showStdOut = true) => {
  return new Promise((resolve, reject) => {
    const spawn = childProcess.spawn(command, args)
    if (showStdOut) {
      spawn.stdout.pipe(process.stdout)
    }

    let output = ''
    spawn.stdout.on('data', (data) => {
      output += data.toString()
    })
    spawn.on('exit', code => {
      resolve(output)
    })
  })
}

module.exports = {
  promisedSpawn
}
