var User = require('./models.js').User;
var Q    = require('q');
var jwt  = require('jwt-simple');

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
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
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
            last_name: lastName
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
