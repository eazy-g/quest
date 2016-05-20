angular.module('cityQuest.authenticationService', [])

.factory('Auth', function ($http, $location, $window, QuestStorage) {
  var auth = {};
  auth.signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      $window.localStorage.setItem('sessiontoken', resp.data.token);
      // default to home city for searches/creation
      $window.localStorage.setItem('city', resp.data.homeCity);
      QuestStorage.saveCity(resp.data.homeCity);
      $location.path('/profile');
    });
  };

  auth.signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      $window.localStorage.setItem('sessiontoken', resp.data.token);
      $window.localStorage.setItem('city', resp.data.homeCity);
      QuestStorage.saveCity(resp.data.homeCity);
      $location.path('/profile')
    });
  };

  auth.isAuth = function () {
    return !!$window.localStorage.getItem('sessiontoken');
  };

  auth.signout = function () {
    $window.localStorage.removeItem('sessiontoken');
    $window.localStorage.removeItem('city');
    $window.localStorage.removeItem('coords');
    $location.path('/');
  };

  return auth;
});
