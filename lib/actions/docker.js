const chalk = require('chalk')
const fse = require('fs-extra')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const join = path.join

const {
  gitClone
} = require('../helpers')

module.exports = async function (cmdObj) {
  try {
    var spinner = ora(chalk.blue('Download Aventum\'s Docker Compose setup')).start()
    await gitClone({
      url: dockerComposeRepo,
      name: 'docker-compose',
      cwd: process.cwd(),
      isCurrent: true
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Rename folders, dashboard to _dashboard & server to _server')).start()
    fs.renameSync(join(process.cwd(), 'server'), join(process.cwd(), '_server'))
    fs.renameSync(join(process.cwd(), 'dashboard'), join(process.cwd(), '_dashboard'))
    spinner.succeed()

    spinner = ora(chalk.blue('Create empty server & dashboard folders')).start()
    fs.mkdirSync(join(process.cwd(), 'server'))
    fs.mkdirSync(join(process.cwd(), 'dashboard'))
    spinner.succeed()

    spinner = ora(chalk.blue('Download Aventum server')).start()
    await gitClone({
      url: serverRepo,
      name: 'server',
      cwd: join(process.cwd(), 'server'),
      isCurrent: true
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Download Aventum dashboard')).start()
    await gitClone({
      url: dashboardRepo,
      name: 'dashboard',
      cwd: join(process.cwd(), 'dashboard'),
      isCurrent: true
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Copy folders, _dashboard to dashboard & _server to server')).start()
    fse.copySync(join(process.cwd(), '_dashboard'), join(process.cwd(), 'dashboard'))
    fse.copySync(join(process.cwd(), '_server'), join(process.cwd(), 'server'))
    spinner.succeed()

    spinner = ora(chalk.blue('Remove _dashboard & _server folders')).start()
    fse.removeSync(join(process.cwd(), '_dashboard'))
    fse.removeSync(join(process.cwd(), '_server'))
    spinner.succeed()

    console.log(chalk.green('That\'s it!'))
    console.log(chalk.green('You can now run:'))
    console.log(chalk.bold.magenta.bgYellow('docker-compose -f docker-compose.postgres.yml up'))
    console.log(chalk.green('to run docker compose with PostgreSQL or run:'))
    console.log(chalk.bold.magenta.bgYellow('docker-compose -f docker-compose.mongodb.yml up'))
    console.log(chalk.green('to run docker compose with MongoDB.'))
    console.log(chalk`After that you can navigate to {bold.red.bgYellow http://localhost/setup} to create your super user!`)
    console.log(chalk.green('For more info https://github.com/TryAventum/docker-compose'))
  } catch (error) {
    console.log(chalk.red(error))
  }
}
