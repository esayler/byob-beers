
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id').primary()
      table.string('first_name')
      table.string('last_name')
      table.string('email')
      table.timestamps(true, true)
    }),
    knex.schema.createTable('favorites', function (table) {
      table.increments('id').primary()
      table.integer('uid')
      table.foreign('uid').references('users.id')
      table.integer('beer_id')
      table.foreign('beer_id').references('beers.id')
      table.timestamps(true, true)
    }),
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('users'),
  ])
}
