var request = require('request');
var vows = require('vows');
var assert = require('assert');

var assertSuccess = function(err, res, body) {
  assert.equal(err, null);
  assert.equal(res.statusCode, 200);
}

vows.describe('Account').addBatch({
  'GET /account/singup/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/account/signup/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  }
}).export(module);
