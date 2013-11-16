var request = require('request');
var vows = require('vows');
var assert = require('assert');

var assertSuccess = function(err, res, body) {
  assert.equal(err, null);
  assert.equal(res.statusCode, 200);
};

vows.describe('View').addBatch({
  'GET /account/singup/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/account/signup/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  },
  'GET /account/login/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/account/login/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  },
  'GET /': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  },
  'GET /topic/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/topic/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  },
  'GET /topic/create/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/topic/create/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  },
  'GET /node/': {
    'topic': function () {
      request({
        uri: 'http://127.0.0.1:3000/node/',
        method: 'GET'
      }, this.callback)
    },
    'assert Success': assertSuccess
  }
}).exportTo(module);
