exports.seed = function (knex, Promise) {
  return knex('breweries').del()
    .then(function () {
      return knex('breweries').insert([
        {
          name: '10 Barrel Brewing Company',
          city: 'Bend',
          state: 'OR',
        },
        {
          name: '18th Street Brewery',
          city: 'Gary',
          state: 'IN',
        },
      ])
    })
}
