var spawn = require('cross-spawn')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora')
const path = require('path')
const join = path.join
const { serverConfigBuilder } = require('./serverConfigBuilder')

module.exports.printHowToRun = function (obj) {
  console.log(chalk.green("That's it!"))
  console.log(chalk.green('You can now run:'))
  console.log(chalk.bold.magenta.bgYellow('aventum run'))
  console.log(chalk.green('To run your Aventum app!'))
}

module.exports.gitClone = function (obj) {
  return new Promise((resolve, reject) => {
    // console.log(chalk.blue('Start git clone...'))

    const gitOptions = obj.isCurrent
      ? ['clone', obj.url, '.']
      : ['clone', obj.url]

    var gitClone = spawn('git', gitOptions, { cwd: obj.cwd })

    gitClone
      .on('exit', function () {
        // console.log(chalk.green('Git clone for ' + obj.name + ' completed!'))
        resolve()
      })
      .on('error', function (err) {
        // console.log(chalk.red(err))
        reject(err)
      })
  })
}

module.exports.npmInstall = function (obj) {
  return new Promise((resolve, reject) => {
    // console.log(chalk.blue('Start npm install...'))

    var theApp = spawn('npm', ['install'], { cwd: obj.cwd })

    theApp
      .on('exit', function () {
        // console.log(chalk.green('npm install for ' + obj.name + ' completed!'))
        resolve()
      })
      .on('error', function (err) {
        // console.log(chalk.red(err))
        reject(err)
      })
  })
}

module.exports.npmRunBuild = function (obj) {
  return new Promise((resolve, reject) => {
    // console.log(chalk.blue('Start npm run build...'))

    var webpack = spawn('npm', ['run', 'build'], { cwd: obj.cwd })

    webpack
      .on('exit', function () {
        // console.log(
        //   chalk.green('npm run build for ' + obj.name + ' completed!')
        // )
        resolve()
      })
      .on('error', function (err) {
        // console.log(chalk.red(err))
        reject(err)
      })
  })
}

const getConfigFromEnv = (fileToRead) => {
  var lines = fs.readFileSync(fileToRead).toString().split('\n')

  const config = {}

  for (const line of lines) {
    const tmp = line.split('=')
    config[tmp[0]] = tmp[1]
  }

  return config
}

const writeConfigToEnv = (config, file) => {
  let data = ''

  const objectLength = Object.keys(config).length

  let index = 1
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      data =
        data + key + '=' + config[key] + (index === objectLength ? '' : '\n')
    }

    index++
  }

  fs.writeFileSync(file, data)
}

module.exports.printDashboardEnvNote = function () {
  console.log(
    chalk`If you changed the server port make sure {bold.red.bgYellow REACT_APP_BASE_URL} in {bold.red.bgYellow .env.production} dashboard file is correct.`
  )
}

module.exports.getServerConfig = async function () {
  try {
    if (serverConfig) {
      return serverConfig
    } else {
      serverConfig = getConfigFromEnv(
        join(process.cwd(), serverFolderName + '/.env.production.local')
      )

      return serverConfig
    }
  } catch (error) {
    chalk.red(error)
    return null
  }
}

module.exports.prepareAndBuild = async function () {
  var spinner
  try {
    // First make sure the backend URL in .env.production file is correct
    spinner = ora(chalk.blue('Prepare to build the dashboard')).start()
    const envFile = `${join(
      process.cwd(),
      dashboardFolderName
    )}/.env.production`
    const envFileData = fs.readFileSync(envFile, 'utf8')
    fs.writeFileSync(
      envFile,
      envFileData.replace(
        '/api/',
        `http://localhost:${serverConfig.PORT}/`
      )
    )
    spinner.succeed()

    // Now build the dashboard
    spinner = ora(chalk.blue('Build the dashboard')).start()
    await module.exports.npmRunBuild({
      name: 'dashboard',
      cwd: join(process.cwd(), dashboardFolderName),
    })
    spinner.succeed()
  } catch (error) {
    spinner.fail(chalk.red(error))
  }
}

module.exports.generateAndSaveServerConfig = async function () {
  var spinner
  try {
    var config = await serverConfigBuilder()

    switch (config.DB_TYPE) {
      default:
      case 'PostgreSQL':
        config.DB_TYPE = 'pg'
        break

      case 'MongoDB':
        config.DB_TYPE = 'mongodb'
        break

      case 'MySQL':
      case 'MariaDB':
        config.DB_TYPE = 'mysql'
        break
    }

    config.SHOW_ERRORS = true

    spinner = ora(chalk.blue('Save server configurations')).start()
    writeConfigToEnv(config, join(process.cwd(), serverFolderName + '/.env.production.local'))
    spinner.succeed()
    serverConfig = config
    return config
  } catch (error) {
    spinner.fail(chalk.red(error))
  }
}
