exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('breweries', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('city')
      table.string('state')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('beers', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('style')
      table.decimal('abv')
      table.decimal('ibu').unsigned()
      table.integer('beer_id')
      table.integer('brewery_id')
      table.foreign('brewery_id').references('breweries.id')
      table.decimal('ounces')
      table.timestamps(true, true)
    }),
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('beers'),
    knex.schema.dropTable('breweries'),
  ])
}
