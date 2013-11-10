var crypto = require('crypto');

exports.random = function(length) {
  crypto.randomBytes(length).digest("hex");
}