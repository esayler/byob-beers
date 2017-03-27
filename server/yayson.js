const Presenter = require('yayson')({ adapter: 'default' }).Presenter
class Beers extends Presenter {}
Beers.prototype.type = 'beers'

class Breweries extends Presenter {}
Breweries.prototype.type = 'breweries'

class Users extends Presenter {}
Users.prototype.type = 'users'

class Favorites extends Presenter {}
Favorites.prototype.type = 'favorites'

module.exports = { Beers, Breweries, Users, Favorites }
