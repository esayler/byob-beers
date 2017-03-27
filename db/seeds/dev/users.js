
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        { first_name: 'Eric',
          last_name: 'Sayler',
          email: 'easayler@gmail.com',
        },
      ])
    })
}
