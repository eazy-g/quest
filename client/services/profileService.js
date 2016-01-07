angular.module('cityQuest.profileService', [])

.factory('Profile', function ($http, $location, $window) {
  var profile = {};

  profile.homeCity = null;

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



  return profile;
});
