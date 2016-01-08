angular.module('cityQuest.profileService', [])

.factory('Profile', function ($http, $location, $window) {
  var profile = {};

  profile.homeCity;

  profile.getProfile = function (token){
    return $http({
      method: 'POST',
      url: '/api/getProfile',
      data: {token: token}
    })
    .then(function (resp){
      return resp.data;
    })
  };

  profile.completeQuest = function(questId, questName, token){
    return $http({
      method: 'POST',
      url: '/api/completeQuest',
      data: {questId: questId, questName: questName, token: token}
    })
    .then(function (resp){
      return resp.data;
    })
  };

  return profile;
});
