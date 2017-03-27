const path = require('path')
const seedFile = require('knex-seed-file')

exports.seed = function (knex, Promise) {
  return Promise.all([knex('beers').del(), knex('breweries').del()])
    .then(_ => seedFile(knex, path.resolve('db/fixtures/breweries.csv'), 'breweries', [
      'id',
      'name',
      'city',
      'state',
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true,
    }))
    .then(_ => seedFile(knex, path.resolve('db/fixtures/beers.csv'), 'beers', [
      'id',
      'abv',
      'ibu',
      'beer_id',
      'name',
      'style',
      'brewery_id',
      'ounces',
    ], {
      columnSeparator: ',',
      ignoreFirstLine: true,
    }))
}
