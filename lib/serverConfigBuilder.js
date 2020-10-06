var inquirer = require('inquirer')

var configQuestions = [
  {
    type: 'list',
    name: 'DB_TYPE',
    message: 'Which database type you want to use?',
    choices: ['PostgreSQL', 'MongoDB', 'MySQL', 'MariaDB']
  },
  {
    type: 'input',
    name: 'DB_NAME',
    message: 'Enter the name of the database ...'
  },
  {
    type: 'input',
    name: 'DB_USER',
    message: 'Enter the database user ...'
  },
  {
    type: 'password',
    name: 'DB_PASSWORD',
    message: 'Enter the database password ...'
  },
  {
    type: 'input',
    name: 'DB_HOST',
    default: '127.0.0.1',
    message: 'Enter the database host ...'
  },
  {
    type: 'input',
    name: 'DB_PORT',
    message: 'Enter the database port ...',
    filter: Number
  },
  {
    type: 'input',
    name: 'PORT',
    default: 3030,
    message: 'Enter the port that the Aventum server will run on ...',
    filter: Number
  },
  {
    type: 'input',
    name: 'REDIS_PORT',
    default: 6379,
    message: 'Enter Redis port ...',
    filter: Number
  },
  {
    type: 'input',
    name: 'REDIS_HOST',
    default: '127.0.0.1',
    message: 'Enter Redis host ...'
  },
  {
    type: 'input',
    name: 'REDIS_DB',
    default: 0,
    message: 'Enter Redis DB ...',
    filter: Number
  },
  {
    type: 'password',
    name: 'REDIS_PASSWORD',
    default: '',
    message: 'Enter the Redis password ...'
  },
  {
    type: 'input',
    name: 'REDIS_FAMILY',
    default: 4,
    message: 'Enter Redis family ...',
    filter: Number
  }
]

function serverConfigBuilder () {
  return new Promise((resolve, reject) => {
    inquirer.prompt(configQuestions).then(answers => {
      resolve(answers)
    })
  })
}

module.exports = {
  serverConfigBuilder
}
