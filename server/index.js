const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const path = require('path')
const router = require('./router')

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.use('/api/v1', router)

app.all((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate")
  res.header("Pragma", "no-cache")
  res.header("Expires", 0)
  next()
})

if (!module.parent) {
  app.listen(app.get('port'), _ => {
    console.log(chalk.green.bold(`BYOB is running on ${app.get('port')}.`))
  })
}

module.exports = app
