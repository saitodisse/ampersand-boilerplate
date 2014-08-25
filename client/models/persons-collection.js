var Collection = require('ampersand-rest-collection');
var Person = require('./person-model');

/*

file:     persons-collection.js
class:    PersonsCollection
instance: personsCollection

*/

module.exports = Collection.extend({
    model: Person,
    url: '/api/people'
});
