var User = require('./models.js').User;
var Q    = require('q');
var jwt  = require('jwt-simple');
var client = require('twilio')('ACaf2d26a87753a45902190e74454abfe4', '9a3f9f79e36f34b827b83b228ab29f00');

module.exports = {
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          res.status(401).send( { message: 'Incorrect Username/Password'  });
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var homeCity = user.home_city;
                var token = jwt.encode(user, 'secret');
                res.json({token: token, homeCity: homeCity});
              } else {
                res.status(401).send( { message: 'Incorrect Username/Password'  });
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        firstName = req.body.firstName,
        lastName = req.body.lastName,
        homeCity = req.body.homeCity,
        telNumber = req.body.telNumber,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          res.status(401).send( { message: 'Username Already Exists!'  });
        } else {
          // make a new user if not one
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            home_city: homeCity,
            tel_number: telNumber
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        console.log('token from userModel: ', token);
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  getProfile: function(req, res, next){
    var token = req.body.token;
    var decoded = jwt.decode(token, 'secret');
    var username = decoded.username;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
    .then(function (user) {
      res.json({profile: user});
      console.log('this is user', user);
    })
    .fail(function (error) {
      next(error);
    });
  },

  storeQuestId: function(req, res, next){

    var questId = req.body.questId;
    var token = req.body.token;
    var decoded = jwt.decode(token, 'secret');
    var userId = decoded._id;

    User.findOneAndUpdate({'_id': userId},
     { $push: { "created_quests_ids": questId }})
      .then (function(err){
        if (err) {
          console.log(err)
        } else {
          res(201, "users quests updated")
        }
      })
    },

  completeQuest: function(req, res, next){
    var token = req.body.token;
    var questId = req.body.questId;

    var decoded = jwt.decode(token, 'secret');
    var userId = decoded._id;
    
    User.findOneAndUpdate(
      { _id: userId },
      { 
        $push: { "completed_quests" : {"quest_id":questId} }
        // ,$pull: {"quests_to_do_ids" : questId}
      }
    )
    .then(function(data){
      User.find({"created_quests_ids": questId})
      .then(function(user){
        console.log('user', user)
        client.sendMessage({
            to:'+18659197597', // Any number Twilio can deliver to
            from: '+18652975047', // A number you bought from Twilio and can use for outbound communication
            body: 'you completed the quest.' // body of the SMS message
        }, function(err, responseData) { if(err){console.log(err);}}
        );
      });
      res.status(201).send();
    })
  },

  // getPhoneNumberFromQuest: function(req, res, next){
  //   var questId = req.body.questId;
  //   User.find({"created_quests_ids": questId})
  //   .then(function(user){
  //     console.log('user', user);
  //   })
  // },

  checkAuth: function (req, res, next) {

    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.status(200).send();
          } else {
            res.status(401).send();
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }
};
