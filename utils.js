var crypto = require('crypto');

exports.sha256 = function(data) {
  return require('crypto').createHash('sha256').update(data).digest('hex');
};

exports.timestamp = function() {
 return Math.round(Date.now() / 1000);
}
