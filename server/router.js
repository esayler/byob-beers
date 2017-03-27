const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const knex = require('knex')(configuration)
const { Beers, Breweries, Users, Favorites } = require('./yayson')

// get all breweries
router.get('/breweries', (req, res) => {
  knex('breweries').count().then(count => {
    console.log(JSON.stringify(count))
    knex('breweries').select().limit(req.query.limit || count).offset(req.query.limit || 0).orderBy('id')
      .then(breweries => {
        res.status(200).json(Breweries.render(breweries, { meta: count[0] }))
      })
      .catch(error => {
        console.error(chalk.red('error getting all breweries', JSON.stringify(error)))
        res.sendStatus(500)
      })
  })
})

// get all beers
router.get('/beers', (req, res) => {
  knex('beers').count().then(count => {
    knex('beers').select().limit(req.query.limit || 50).offset(req.query.limit || 0)
      .then(beers => {
        res.status(200).json(Beers.render(beers, { meta: count[0] }))
      })
      .catch(error => {
        console.error(chalk.red('error getting all beers', JSON.stringify(error)))
        res.sendStatus(500)
      })
  })
})

// get all users
router.get('/users', (req, res) => {
  knex('users').select()
    .then(users => {
      res.status(200).json(Users.render(users))
    })
    .catch(error => {
      console.error(chalk.red('error getting all users', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get all favorites
router.get('/favorites', (req, res) => {
  knex('favorites').select()
    .then(favorites => {
      res.status(200).json(Favorites.render(favorites))
    })
    .catch(error => {
      console.error(chalk.red('error getting all favorites', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific beer
router.get('/beers/:id', (req, res) => {
  const { id } = req.params
  knex('beers').where('id', id)
    .then(beers => {
      res.status(200).json(Beers.render(beers))
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific brewery
router.get('/breweries/:id', (req, res) => {
  const { id } = req.params
  knex('breweries').where('id', id)
    .then(breweries => {
      res.status(200).json(Breweries.render(breweries))
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific user
router.get('/users/:id', (req, res) => {
  const { id } = req.params
  knex('users').where('id', id)
    .then(users => {
      res.status(200).json(Users.render(users))
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get a specific favorite
router.get('/favorites/:id', (req, res) => {
  const { id } = req.params
  knex('favorites').where('id', id)
    .then(favorites => {
      res.status(200).json(Favorites.render(favorites))
    })
    .catch(error => {
      console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get all of the beers for a specific brewery
router.get('/breweries/:id/beers', (req, res) => {
  const { id } = req.params
  knex('beers').where('brewery_id', id)
    .then(beers => {
      res.status(200).json(Beers.render(beers))
    })
    .catch(error => {
      console.error(chalk.red('error getting all beers for a brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// get all of the favorites for a specific user
router.get('/users/:id/favorites', (req, res) => {
  const { id } = req.params
  knex('favorites')
  .join('beers', 'favorites.beer_id', '=', 'beers.id')
  .select().where('favorites.uid', id)
    .then(favorites => {
      res.status(200).json(Favorites.render(favorites))
    })
    .catch(error => {
      console.error(chalk.red('error getting all beers for a brewery', JSON.stringify(error)))
      res.sendStatus(500)
    })
})

// add a brewery
router.post('/breweries', (req, res) => {
  const { name, city, state } = req.body
  const brewery = { name, city, state }
  knex('breweries').insert(brewery)
    .then(_ => {
      knex('breweries').select()
        .then(breweries => {
          res.status(200).json(Breweries.render(breweries))
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
router.post('/breweries/:id/beers', (req, res) => {
  const { id } = req.params
  const { name, style, abv, ibu, beer_id, brewery_id, ounces } = req.body
  const beer = { name, style, abv, ibu, beer_id, brewery_id, ounces }

  knex('beers').insert(beer)
  .then(_ => {
    knex('beers').where('brewery_id', id)
    .then(beers => {
      res.status(200).json(Beers.render(beers))
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

// add a favorite for a specfic user
router.post('/users/:id/favorites', (req, res) => {
  const { id } = req.params
  const { beer_id } = req.body
  const favorite = { uid: id, beer_id }

  knex('favorites').insert(favorite)
  .then(_ => {
    knex('favorites').where('uid', id)
    .then(favorites => {
      res.status(200).json(Favorites.render(favorites))
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

// add a user
router.post('/users', (req, res) => {
  const { first_name, last_name, email } = req.body
  const user = { first_name, last_name, email }
  knex('users').insert(user)
    .then(_ => {
      knex('users').select()
        .then(users => {
          res.status(200).json(Users.render(users))
        })
        .catch(error => {
          console.error(chalk.red('error retrieving users from db: ', JSON.stringify(error)))
        })
    }).catch(error => {
      console.error(chalk.red('error adding user to db: ', error))
      res.status(500).json(error)
    })
})

// update a specific beer
router.patch('/beers/:id', (req, res) => {
  const { id } = req.params
  const { name, style, abv, ibu, beer_id, brewery_id, ounces } = req.body
  const beer = { name, style, abv, ibu, beer_id, brewery_id, ounces }

  knex('beers').where('id', id)
  .update(beer)
  .then(_ => {
    knex('beers').where('id', id).then(beers => res.status(200).json(Beers.render(beers)))
  })
  .catch(error => {
    console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
    res.sendStatus(500)
  })
})

// update a specific brewery
router.patch('/breweries/:id', (req, res) => {
  const { id } = req.params
  const { name, city, state } = req.body
  const brewery = { name, city, state }

  knex('breweries').where('id', id)
  .update(brewery)
  .then(_ => {
    knex('breweries').where('id', id).then(breweries => res.status(200).json(Breweries.render(breweries)))
  })
  .catch(error => {
    console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
    res.sendStatus(500)
  })
})

router.patch('/users/:id', (req, res) => {
  const { id } = req.params
  const { first_name, last_name, email } = req.body
  const user = { first_name, last_name, email }

  knex('users').where('id', id)
  .update(user)
  .then(_ => {
    knex('users').where('id', id).then(users => res.status(200).json(Users.render(users)))
  })
  .catch(error => {
    console.error(chalk.red('error getting a specific beer', JSON.stringify(error)))
    res.sendStatus(500)
  })
})

module.exports = router
