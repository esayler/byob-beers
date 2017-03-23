const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const path = require('path')
// const moment = require('moment')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const knex = require('knex')(configuration)

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

// get all breweries
app.get('/api/v1/breweries', (req, res) => {
  knex('breweries').select()
    .then(breweries => {
      res.status(200).json(breweries)
    })
    .catch(error => {
      console.error(chalk.red('error getting all breweries', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get all beers
app.get('/api/v1/beers', (req, res) => {
  knex('beers').select()
    .then(beers => {
      res.status(200).json(beers)
    })
    .catch(error => {
      console.error(chalk.red('error getting all beers', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific beer
app.get('/api/v1/beers/:id', (req, res) => {
  const { id } = req.params
  knex('beers').where('id', id)
    .then(beers => {
      res.status(200).json(beers)
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific brewery
app.get('/api/v1/breweries/:id', (req, res) => {
  const { id } = req.params
  knex('breweries').where('id', id)
    .then(breweries => {
      res.status(200).json(breweries)
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get all of the beers for a specific brewery
app.get('/api/v1/breweries/:id/beers', (req, res) => {
  const { id } = req.params
  knex('beers').where('brewery_id', id)
    .then(beers => {
      res.status(200).json(beers)
    })
    .catch(error => {
      console.error(chalk.red('error getting all beers for a brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// add a brewery
app.post('/api/v1/breweries', (req, res) => {
  const { name, city, state } = req.body
  const brewery = { name, city, state }
  knex('breweries').insert(brewery)
    .then(_ => {
      knex('breweries').select()
        .then(breweries => {
          res.status(200).json(breweries)
        })
        .catch(error => {
          console.error(chalk.red('error adding a brewery to db: ', JSON.stringify(error)))
        })
    }).catch(error => {
      console.error(chalk.red('error adding a brewery to db: ', error))
      res.status(500).json(error)
    })
})

// add a beer to a specific brewery
app.post('/api/v1/breweries/:id/beers', (req, res) => {
  const { id } = req.params
  const { name, style, abv, ibu, beer_id, brewery_id, ounces } = req.body
  const beer = { name, style, abv, ibu, beer_id, brewery_id, ounces }

  knex('beers').insert(beer)
  .then(_ => {
    knex('beers').where('brewery_id', id)
    .then(beers => {
      res.status(200).json(beers)
    })
    .catch(error => {
      console.error(chalk.red('error geting brewery beers', JSON.stringify(error)))
      res.status(500).json({error})
    })
  })
  .catch(error => {
    console.error(chalk.red('error adding a beer to db: ', error))
    res.status(500).json(error)
  })
})

// update a specific beer
app.patch('/api/v1/beers/:id', (req, res) => {
  const { id } = req.params
  const { name, style, abv, ibu, beer_id, brewery_id, ounces } = req.body
  const beer = { name, style, abv, ibu, beer_id, brewery_id, ounces }

  knex('beers').where('id', id)
  .update(beer)
  .then(_ => {
    knex('beers').where('id', id).then(beer => res.status(200).json(beer))
  })
  .catch(error => {
    console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
    res.sendStatus(500)
  })
})

// update a specific brewery
app.patch('/api/v1/breweries/:id', (req, res) => {
  const { id } = req.params
  const {  } = req.body

  knex('breweries').where('id', id)
    .then(breweries => {
      res.status(200).json(breweries)
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})


if (!module.parent) {
  app.listen(app.get('port'), _ => {
    console.log(chalk.green.bold(`BYOB is running on ${app.get('port')}.`))
  })
}
