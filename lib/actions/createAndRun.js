const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const join = path.join
const {
  gitClone,
  prepareAndBuild,
  npmInstall,
  generateAndSaveServerConfig,
  printHowToRun
} = require('../helpers')
const runServers = require('./runServers')

module.exports = async function (cmdObj) {
  var spinner
  try {
    // if (!isServerConfigExist()) {
    //   var answers = await inquirer.prompt(askForServerConfigPermission)
    //   if (answers.askForOverwrite) {
    //     var config = await generateAndSaveServerConfig()
    //   } else {
    //     console.log(chalk.red(`Can't continue without the configurations!`))
    //     process.exit()
    //   }
    // }

    // 1. Download the server and the dashboard.
    spinner = ora(chalk.blue('Download Aventum server')).start()
    await gitClone({
      url: serverRepo,
      name: 'server',
      cwd: process.cwd()
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Install server dependencies')).start()
    await npmInstall({
      name: 'server',
      cwd: join(process.cwd(), serverFolderName)
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Download Aventum dashboard')).start()
    await gitClone({
      url: dashboardRepo,
      name: 'dashboard',
      cwd: process.cwd()
    })
    spinner.succeed()

    spinner = ora(chalk.blue('Install dashboard dependencies')).start()
    await npmInstall({
      name: 'dashboard',
      cwd: join(process.cwd(), dashboardFolderName)
    })
    spinner.succeed()

    // 2. Create .env.production.local for the server.
    await generateAndSaveServerConfig()

    // 3. Build the dashboard files.
    await prepareAndBuild()

    // 4. Run the server and serve the dashboard, if the user want to.
    if (cmdObj.run) {
      runServers({
        cwd: join(process.cwd(), serverFolderName),
        cmdObj
      })
    } else {
      printHowToRun()
    }
  } catch (error) {
    spinner.fail(chalk.red(error))
  }
}
