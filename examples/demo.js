/* @flow */
const http = require('http')
const net = require('net')
const { spawn } = require('child_process')

function isPortOpen (port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port })
    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
    socket.setTimeout(1000, () => {
      socket.destroy()
      resolve(false)
    })
  })
}

function isCatcherHealthy () {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:1080', (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500)
      res.resume()
    })
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      // $FlowIgnore - destroy exists at runtime
      req.destroy()
      resolve(false)
    })
  })
}

function wait (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runCommand (cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true })
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`"${cmd} ${args.join(' ')}" exited with code ${code || 1}`))
    })
    child.on('error', reject)
  })
}

async function waitForCatcherStartup (timeoutMs) {
  const startedAt = Date.now()
  while ((Date.now() - startedAt) < timeoutMs) {
    const smtpUp = await isPortOpen(1025)
    const webUp = await isPortOpen(1080)
    const healthy = webUp ? await isCatcherHealthy() : false
    if (smtpUp && webUp && healthy) return true
    await wait(250)
  }
  return false
}

async function main () {
  const nodeMajor = Number(process.versions.node.split('.')[0])
  const forceCatcher = process.env.NOTIFME_DEMO_FORCE_CATCHER === 'true'
  const catcherKnownIncompatible = Number.isFinite(nodeMajor) && nodeMajor >= 22

  if (catcherKnownIncompatible && !forceCatcher) {
    console.warn(
      `Notification Catcher is not compatible with Node ${process.versions.node}. Running logger demo instead. ` +
      'Set NOTIFME_DEMO_FORCE_CATCHER=true to force catcher mode.'
    )
    await runCommand('babel-node', ['examples/simple.js'])
    return
  }

  const smtpUp = await isPortOpen(1025)
  const webUp = await isPortOpen(1080)
  const healthy = webUp ? await isCatcherHealthy() : false

  if ((smtpUp || webUp) && !healthy) {
    throw new Error(
      'Ports 1025/1080 are in use but Notification Catcher is not healthy. Stop the existing process and retry.'
    )
  }

  let catcherProcess = null
  const shouldStartCatcher = !(smtpUp && webUp && healthy)

  try {
    if (shouldStartCatcher) {
      catcherProcess = spawn('notification-catcher', { stdio: 'inherit', shell: true })
      const started = await waitForCatcherStartup(15000)
      if (!started) throw new Error('Notification Catcher did not start within 15s.')
    } else {
      console.log('Using existing Notification Catcher on http://127.0.0.1:1080')
    }

    await runCommand('babel-node', ['examples/with-notification-catcher.js'])
    console.log('\n>>> Please visit http://localhost:1080 <<<\n')
  } finally {
    if (catcherProcess) catcherProcess.kill('SIGTERM')
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
