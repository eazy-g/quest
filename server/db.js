var mongoose = require('mongoose');
mongoose.connect("mongodb://quatro:code4@ds039165.mongolab.com:39165/questquatro", function(){});
var db = mongoose.connection;

module.exports.db = db;


