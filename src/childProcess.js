const childProcess = require('child_process')

/**
 * Spawn new process and redirect its output to this process output.
 * Resolve promise on finished
 */
const promisedSpawn = {
  chained: (chain) => {
    return new Promise((resolve, reject) => {
      let prevSpawn = null
      let spawn = null
      for (let i = 0; i < chain.length; i++) {
        const [command, args] = chain[i]
        if (process.env.DEBUG) {
          console.log(command, args)
        }

        if (i < chain.length - 1) {
          spawn = childProcess.spawn(command, args)
        } else {
          spawn = childProcess.spawn(command, args, { stdio: 'inherit' })
        }

        if (prevSpawn !== null) {
          prevSpawn.stdout?.pipe(spawn.stdin)
          prevSpawn.stderr?.pipe(spawn.stdin)
        }
        prevSpawn = spawn
      }

      spawn.on('exit', code => {
        resolve(code)
      })
    })
  },
  chainedWithOutput: (chain) => {
    return new Promise((resolve, reject) => {
      let prevSpawn = null
      let spawn = null
      for (const [command, args] of chain) {
        if (process.env.DEBUG) {
          console.log(command, args)
        }

        spawn = childProcess.spawn(command, args)

        if (prevSpawn !== null) {
          prevSpawn.stdout.pipe(spawn.stdin)
        }
        prevSpawn = spawn
      }

      let output = ''
      spawn.stdout.on('data', (data) => {
        output += data.toString()
      })
      spawn.on('exit', code => {
        resolve(output)
      })
    })
  },
}

module.exports = {
  promisedSpawn,
}
