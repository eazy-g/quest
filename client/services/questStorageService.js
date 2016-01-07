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

  questStorage.getAllQuests = function(){
    //the or 'austin' is a temporary placeholder to get quests for front page
    var searchCity = $window.localStorage.getItem('city') || 'austin';
    return $http.get(
       '/api/quests/?city=' + searchCity
        )
        .then(function(res){
          var fetchedQuests = res.data;
          return fetchedQuests;
        })
        .catch(function(err){
          console.log("getAllQuests did not return any quests: ", err);
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

