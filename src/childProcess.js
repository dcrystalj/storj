const childProcess = require('child_process')

/**
 * Spawn new process and redirect its output to this process output.
 * Resolve promise on finished
 */
const promisedSpawn = (chain, showStdOut = true) => {
  return new Promise((resolve, reject) => {
    let prevSpawn = null
    let spawn = null
    for (const [command, args] of chain) {
      spawn = childProcess.spawn(command, args)
      if (prevSpawn !== null) {
        prevSpawn.stdout.pipe(spawn.stdin)
      }
      prevSpawn = spawn
    }

    if (showStdOut) {
      spawn.stdout.pipe(process.stdout)
      spawn.stderr.pipe(process.stderr)
      spawn.stdin.pipe(process.stdin)
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
  promisedSpawn,
}
