var http = require("http");
var bodyParser = require('body-parser');
var express = require('express');
var geocoder = require('geocoder');
var app = express();
var path = require('path');
var mongo = require('./db.js');
var models = require('./models.js');
var userModels = require('./userModel.js');
var jwt = require('express-jwt');
var app = express();
var db = mongo.db;
var Quest = models.Quest;
var User = models.User;
var signup = userModels.signup;
var signin = userModels.signin;
var authUser = userModels.checkAuth;
var getProfile = userModels.getProfile;
var storeQuestId = userModels.storeQuestId;
var completeQuest = userModels.completeQuest;
var getPhoneNumberFromQuest = userModels.getPhoneNumberFromQuest;
var queueQuest = userModels.queueQuest;
var storeRating = userModels.storeRating;

//twilio client
var client = require('twilio')('ACaf2d26a87753a45902190e74454abfe4', '9a3f9f79e36f34b827b83b228ab29f00');

app.use('api/quests*', jwt);

app.use(bodyParser.json());

app.set('port', 3000);

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.post('/api/quests*', function(req, res){
	Quest.find(req.body).then(function(quests){
		if(quests.length > 0){
			res.send('An identical quest already exists');
		}
		else{
			var newQuest = new Quest(req.body);
			newQuest.save(function(err, result){
				if(err){
					console.log('help');
					console.log(err);
				}
				res.send(result);
			});
		}
	});
});

app.post('/api/users/signup', function(req, res){
	signup(req, res, res.send);
});

app.post('/api/users/signin', function(req, res){
	signin(req, res, res.send);
});

app.get('/api/twoquests', function(req, res){
	Quest.find().limit(2).then(function(quests){
		res.send(quests);
	});
});

app.get('/api/quests*', function(req, res){

	if(req.query.hasOwnProperty('_id') && req.query._id.indexOf(',') > -1){
		var idArray = req.query._id.split(',')
		Quest.find({
			'_id' : { $in : idArray}
		})
		.then(function(quests){
			res.send(quests);
		});
	}
	else{
		Quest.find(req.query).then(function(quests){
			res.send(quests);
		});
	}
});

app.post('/api/geocode*', function(req, res){
  geocoder.geocode(req.body.city, function ( err, data ) {
    if(err) throw err;
    res.send(data.results[0].geometry.location);
  });
});

app.post('/api/getProfile', function (req, res){
	getProfile(req, res, res.send);
});

app.post('/api/storeQuestId', function (req, res) {
  storeQuestId(req, res, res.send);
});

app.post('/api/completeQuest', function (req,res){
	completeQuest(req, res, res.send);
});

app.post('/api/queueQuest', function (req,res){
	queueQuest(req, res, res.send);
})

// Wildcard Files
app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname + '/../' + req.url));
});

app.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'));
});

app.post('/api/getRating', function (req, res) {
  storeRating(req, res, res.send);
});
