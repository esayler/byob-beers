exports.seed = function (knex, Promise) {
  return knex('beers').del()
    .then(knex('breweries').del())
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
    .then(function () {
      return knex('beers').insert([
        {
          abv: '0.071',
          beer_id: 2264,
          name: 'Rise of the Phoenix',
          style: 'American IPA',
          brewery_id: 1,
          ounces: 12.0,
        },
        {
          abv: '0.066',
          beer_id: 2265,
          name: "Devil's Cup",
          style: 'American Pale Ale (APA)',
          brewery_id: 2,
          ounces: 12.0,
        },
        {
          abv: '0.071',
          beer_id: 2264,
          name: 'Rise of the Phoenix',
          style: 'American IPA',
          brewery_id: 2,
          ounces: 12.0,
        },
      ])
    })
}
