angular.module('cityQuest.questStorageService', [])

.factory('QuestStorage', function($http, $location, $window){
  var questStorage = {};
  questStorage.saveCity = function(cityStr){
    $window.localStorage.setItem('city', cityStr);
    this.setCityCoordinates(cityStr);
  };

  questStorage.setCityCoordinates = function(cityStr){
    return $http({
        method: 'POST',
        url: '/api/geocode',
        data: {"city": cityStr}
    })
    .then(function(res){
      $window.localStorage.setItem('coords', JSON.stringify(res.data));
    });
  };

  questStorage.getCity = function(){
    var cityName = $window.localStorage.getItem('city');
    if(cityName){
      return cityName;
    }
    else{
      $location.path('/');
    }
  };

  questStorage.getCoords = function(){
    var coords = $window.localStorage.getItem('coords');
    return JSON.parse(coords);
  };

  questStorage.getSingleQuest = function(questId){
    return $http.get(
      '/api/quests/?_id=' + questId
      ).then(function(res){
        return res.data[0];
    })
    .catch(function(err){
        console.log("getSingleQuest did not return any quests: ", err);
    });
  };

  questStorage.getRating = function(questId, rating){
    $http({
        method: 'POST',
        url: '/api/getRating',
        data: {'questId': questId, 'rating': rating}
      })
      .then(function(res){
        return res.data[0];
    })
    .catch(function(err){
        console.log("getRating did not return any quests: ", err);
    });
  };

  questStorage.getAllQuests = function(){
    return $http.get(
       '/api/quests/?city=' + $window.localStorage.getItem('city')
        )
        .then(function(res){
          var fetchedQuests = res.data;
          return fetchedQuests;
        })
        .catch(function(err){
          console.log("getAllQuests did not return any quests: ", err);
        });
  };

  questStorage.getTwoRandomQuests = function(){
    return $http.get(
      '/api/twoquests')
      .then(function(res){
        var fetchedQuests = res.data;
        return fetchedQuests;
      })
      .catch(function(err){
        console.log("get two quests did not work", err);
      });
  };

  questStorage.getAllQuestsById = function(questIds){
    return $http.get(
     '/api/quests/?_id=' + questIds
      )
      .then(function(res){
        var fetchedQuestsByIds = res.data;
        return fetchedQuestsByIds;
      })
      .catch(function(err){
        console.log("getAllQuestsByIds did not return any quests: ", err);
      });
  };

  questStorage.queueQuest = function(questId, token){
    console.log('hi');
    return $http({
      method: 'POST',
      url: '/api/queueQuest',
      data: {questId: questId, token: token}
    })
    .then(function (resp){
      return resp.data;
    })
  };

  questStorage.saveNewQuestAndGoToQuestList = function(quest){
    $http({
        method: 'POST',
        url: '/api/quests',
        data: quest
      })
    .then(function(res){
      var token = $window.localStorage.getItem('sessiontoken');
      $http({
        method: 'POST',
        url: '/api/storeQuestId',
        data: {"questId": res.data._id, "token": token}
      })
    })
    .then(function(res){
      $location.path('/questList');
    });
  };

  return questStorage;
});

