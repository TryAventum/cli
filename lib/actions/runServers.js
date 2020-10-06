const chalk = require('chalk')
const express = require('express')
const path = require('path')

const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter()

const join = path.join
var spawn = require('cross-spawn')
const { getServerConfig } = require('../helpers')

var runServers = []
var alreadyDisplayed = false

function printIt (dashboardPort) {
  console.log(chalk`You can now navigate to {bold.black.bgWhite http://localhost:${dashboardPort}/setup} to create your super user!`)
  console.log(chalk`Or access your dashboard at {bold.black.bgWhite http://localhost:${dashboardPort}}`)
}

myEmitter.on('serverRun', (whichServer, data, dashboardPort) => {
  if (!alreadyDisplayed && runServers.includes('server') && runServers.includes('dashboard')) {
    printIt(dashboardPort)
    alreadyDisplayed = true
  } else if (runServers.length < 2 && !runServers.includes(whichServer)) {
    if (whichServer === 'server') {
      if (data.includes(`Listening on port ${serverConfig.PORT}!`)) {
        runServers.push(whichServer)
      }
    } else {
      runServers.push(whichServer)
    }
    if (!alreadyDisplayed && runServers.includes('server') && runServers.includes('dashboard')) {
      printIt(dashboardPort)
      alreadyDisplayed = true
    }
  }
})

module.exports = async function (options) {
  const dashboardPort = options.cmdObj.dashboardPort || 3333
  // console.log(chalk.blue('Start Aventum server...'))
  serverConfig = await getServerConfig()

  var runNodeApp = spawn('npm', ['start'], { cwd: options.cwd })

  runNodeApp.stdout.setEncoding('utf8')
  runNodeApp.stdout.on('data', function (data) {
    console.log(chalk.cyan('Server: ' + data))
    myEmitter.emit('serverRun', 'server', data, dashboardPort)
  })

  runNodeApp.stderr.setEncoding('utf8')
  runNodeApp.stderr.on('data', function (data) {
    console.log(chalk.red(data))
  })

  runNodeApp.on('close', function (code) {
    console.log(chalk.red(code))
  })

  runNodeApp
    .on('exit', function () {
      console.log(chalk.green('Node for the server exited!'))
      return true
    })
    .on('error', function (err) {
      console.log(chalk.red(err))
      throw err
    })

  var app = express()
  app.use(express.static(join(process.cwd(), dashboardFolderName + '/build')))
  app.get('*', function (request, response) {
    response.sendFile(
      join(process.cwd(), dashboardFolderName + '/build/index.html')
    )
  })
  app.listen(dashboardPort, () => {
    console.log(chalk.magenta(`Dashboard: Listening on port ${dashboardPort}!`))
    myEmitter.emit('serverRun', 'dashboard', dashboardPort, dashboardPort)
  })
}
