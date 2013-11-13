var request = require('request');
var vows = require('vows');
var assert = require('assert');

vows.describe('Account').addBatch({
  'GET /account/singup/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/account/signup/',
        method: 'GET'
      }, this.callback)
    },
    "should respond with 200": function (err, res, body) {
      assert.equal(res.statusCode, 200);
    }
  }
}).export(module);
