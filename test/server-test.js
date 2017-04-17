process.env.NODE_ENV = 'test'
const config = require('../knexfile.js')['test']
const knex = require('knex')(config)
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const assert = chai.assert
const should = chai.should()
const app = require('../server')
const util = require('util')

chai.use(chaiHttp)

describe('Server', function () {
  it('should exist', function () {
    expect(app).to.exist
  })
})

describe('API Routes', function () {
  beforeEach(function (done) {
    const breweries = [
      { id: 1, name: 'brewery1', city: 'city1', state: 'state1' },
      { id: 2, name: 'brewery2', city: 'city2', state: 'state2' },
    ]

    const beers = [
      { name: 'beer1', id: 1, style: 'style1', ibu: 0.05, beer_id: 99, brewery_id: 1, ounces: 12 },
      { name: 'beer2', id: 2, style: 'style2', ibu: 0.06, beer_id: 98, brewery_id: 2, ounces: 12 },
    ]

    const users = [
      { id: 1, first_name: 'first1', last_name: 'last1', email: 'mail1@mail.com' },
      { id: 2, first_name: 'first2', last_name: 'last1', email: 'mail2@mail.com' },
    ]

    const favorites = [
      { id: 1, uid: 1, beer_id: 1 },
      { id: 2, uid: 2, beer_id: 2 },
    ]

    knex.migrate.rollback()
    .then(function () {
      knex.migrate.latest()
      .then(_ => {
        knex('breweries').insert(breweries)
        .then(_ => knex('beers').insert(beers))
        .then(_ => knex('users').insert(users))
        .then(_ => knex('favorites').insert(favorites))
        .then(_ => done())
      })
    })
  })

  afterEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
        done()
      })
  })

  describe('GET /api/v1/breweries', function () {
    it('should return all breweries', () => {
      return chai.request(app)
        .get('/api/v1/breweries')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.meta.should.be.a('object')
          res.body.meta.should.have.property('count')
            .that.is.a('string')
            .that.equals('2')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(2)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
            .that.equals('1')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('breweries')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('brewery1')
          res.body.data[0].attributes.should.have.property('city')
            .that.is.a('string')
            .that.equals('city1')
          res.body.data[0].attributes.should.have.property('state')
            .that.is.a('string')
            .that.equals('state1')
          res.body.data[0].attributes.should.have.property('created_at')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('updated_at')
            .that.is.a('string')
        })
        .catch(err => {
          throw (err)
        })
    })
  })

  describe('GET /api/v1/beers', () => {
    it('should return all beers', () => {
      return chai.request(app)
        .get('/api/v1/beers')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.meta.should.be.a('object')
          res.body.meta.should.have.property('count')
            .that.is.a('string')
            .that.equals('2')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(2)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
            .that.equals('1')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('beers')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('beer1')
          res.body.data[0].attributes.should.have.property('style')
            .that.is.a('string')
            .that.equals('style1')
          res.body.data[0].attributes.should.have.property('ibu')
            .that.is.a('string')
            .that.equals('0.05')
          res.body.data[0].attributes.should.have.property('beer_id')
            .that.is.a('number')
            .that.equals(99)
          res.body.data[0].attributes.should.have.property('brewery_id')
            .that.is.a('number')
            .that.equals(1)
          res.body.data[0].attributes.should.have.property('ounces')
            .that.is.a('string')
            .that.equals('12.00')
          res.body.data[0].attributes.should.have.property('created_at')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('updated_at')
            .that.is.a('string')
        })
        .catch(err => {
          throw (err)
        })
    })
  })

  describe('GET /api/v1/breweries/:id', () => {
    it('should return a specifc brewery', () => {
      return chai.request(app)
        .get('/api/v1/breweries/1')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(1)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
            .that.equals('1')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('breweries')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('brewery1')
          res.body.data[0].attributes.should.have.property('city')
            .that.is.a('string')
            .that.equals('city1')
          res.body.data[0].attributes.should.have.property('state')
            .that.is.a('string')
            .that.equals('state1')
          res.body.data[0].attributes.should.have.property('created_at')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('updated_at')
            .that.is.a('string')
        })
        .catch(err => {
          throw (err)
        })
    })
  })

  describe('GET /api/v1/breweries/:id/beers', () => {
    it('should return all beers belonging to a specific brewery', () => {
      return chai.request(app)
        .get('/api/v1/breweries/1/beers')
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(1)
          res.body.data[0].should.have.property('id')
            .that.is.a('string')
            .that.equals('1')
          res.body.data[0].should.have.property('type')
            .that.is.a('string')
            .that.equals('beers')
          res.body.data[0].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('beer1')
          res.body.data[0].attributes.should.have.property('style')
            .that.is.a('string')
            .that.equals('style1')
          res.body.data[0].attributes.should.have.property('ibu')
            .that.is.a('string')
            .that.equals('0.05')
          res.body.data[0].attributes.should.have.property('beer_id')
            .that.is.a('number')
            .that.equals(99)
          res.body.data[0].attributes.should.have.property('brewery_id')
            .that.is.a('number')
            .that.equals(1)
          res.body.data[0].attributes.should.have.property('ounces')
            .that.is.a('string')
            .that.equals('12.00')
          res.body.data[0].attributes.should.have.property('created_at')
            .that.is.a('string')
          res.body.data[0].attributes.should.have.property('updated_at')
            .that.is.a('string')
        })
        .catch(err => {
          throw (err)
        })
    })
  })

  describe('POST /api/v1/breweries', () => {
    it('should return all breweries with the added brewry', () => {
      return chai.request(app)
        .post('/api/v1/breweries')
        .send({ id: 3, name: 'brewery3', city: 'city3', state: 'state3' })
        .then(res => {
          console.log(util.inspect(res.body))
          console.log(util.inspect(res.body.data))
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.meta.should.be.a('object')
          res.body.meta.should.have.property('count')
            .that.is.a('string')
            .that.equals('3')
          res.body.data.should.be.a('array')
          res.body.data.length.should.equal(3)
          res.body.data[2].should.have.property('id')
            .that.is.a('string')
            .that.equals('3')
          res.body.data[2].should.have.property('type')
            .that.is.a('string')
            .that.equals('breweries')
          res.body.data[2].attributes.should.have.property('name')
            .that.is.a('string')
            .that.equals('brewery3')
          res.body.data[2].attributes.should.have.property('city')
            .that.is.a('string')
            .that.equals('city3')
          res.body.data[2].attributes.should.have.property('state')
            .that.is.a('string')
            .that.equals('state3')
          res.body.data[2].attributes.should.have.property('created_at')
            .that.is.a('string')
          res.body.data[2].attributes.should.have.property('updated_at')
            .that.is.a('string')
        })
        .catch(err => {
          throw (err)
        })
    })
  })

  describe('POST /api/v1/breweries/:id/beers', function() {
    it.skip('should return all beers belonging to the specifed folder, including the added url', function(done){
    chai.request(app)
      .post(`/api/v1/breweries/${1}/beers`)
      .send({ long_url: 'www.turing.io' })
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        // res.body.length.should.equal(2)
        res.body[0].should.have.property('visits')
        res.body[0].should.have.property('id')
        res.body[0].should.have.property('long_url')
        res.body[0].should.have.property('created_at')
        res.body[0].should.have.property('updated_at')
        done()
      })
    })
  })

  // describe('GET /:id', function() {
  //   it.skip('should redirect to the long_url associated with that id', function(done){
  //   chai.request(app)
  //     .get(`/2`)
  //     .end(function (err, res) {
  //       res.should.have.status(200)
  //       expect(res).to.redirect
  //       expect(res).to.redirectTo('http://www.animals.com/')
  //       res.should.be.html
  //       done()
  //     })
  //   })
  // })
})
