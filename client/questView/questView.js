   angular.module('cityQuest.questView', [])

.controller('questViewCtrl', function($location, $scope, $routeParams, $window, QuestStorage, uiGmapGoogleMapApi, Auth, InputConversion){
  $scope.questId = $routeParams.questId;
  $scope.rating = 0;
  $scope.notVoted = true;
  $scope.token = $window.localStorage.getItem('sessiontoken');

  //if the city has been set by searching for a city
  if(!!$window.localStorage.getItem('city')){
    $scope.myloc = QuestStorage.getCoords();
    $scope.markers = [];
    $scope.currCity = InputConversion.capitalizeFirstLetter($window.localStorage.getItem('city'));
    uiGmapGoogleMapApi.then(function(maps){
      fetch();
      $scope.map = {
        events: {
              tilesloaded: function (map) {
                  $scope.$apply(function () {
                      $scope.mapInstance = map;
                  });
              },
        },
        center: {
           latitude: $scope.myloc.lat,
           longitude: $scope.myloc.lng
        },
        zoom: 11,
        options: {
          scrollwheel: false
        }
      }
    });
  }else{ //otherwise, we are trying to get to a quest from the home page
    QuestStorage.getSingleQuest($scope.questId)
    .then(function(quest){
      $window.localStorage.setItem('city', quest.city);
      return quest;
    })
    .then(function(quest){
      return QuestStorage.setCityCoordinates(quest.city);
    })
    .then(function(){
      console.log('coords', $window.localStorage.getItem('coords'))
        $scope.myloc = QuestStorage.getCoords();
        console.log('scope.myloc', $scope.myloc);
          $scope.markers = [];
          $scope.currCity = InputConversion.capitalizeFirstLetter($window.localStorage.getItem('city'));
          uiGmapGoogleMapApi.then(function(maps){
            fetch();
            $scope.map = {
              events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $scope.mapInstance = map;
                        });
                    },
              },
              center: {
                 latitude: $scope.myloc.lat,
                 longitude: $scope.myloc.lng
              },
              zoom: 11,
              options: {
                scrollwheel: false
              }
            }
          });
    });
  }


  var fetch = function(cb){
    QuestStorage.getSingleQuest($scope.questId).then(function(quest){
      $scope.quest = quest;
      //compute the averga rating of the quest and store in $scope.averageRating
      $scope.averageRating = Math.round($scope.quest.rating.reduce(function(a,b){
        return a + b;
      })/$scope.quest.rating.length);
      $scope.quest.time = InputConversion.minutesToHours($scope.quest.time);
      $scope.quest.steps.forEach(function(step){
        step.cost = InputConversion.moneyConversion(step.cost)
        step.time = InputConversion.minutesToHours(step.time);
        var iconNum = $scope.markers.length + 1;
        var iconUrl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + iconNum + "|a3bd29|000000";
        var newMarker = {
          id: $scope.markers.length,
          coords: step.location,
          options: {
            icon: iconUrl,
            labelClass: "marker-labels"
          }
        };
        $scope.markers.push(newMarker);
      });
    });
  };

  $scope.signout = function() {
    Auth.signout();
  };

  $scope.getRating = function() {
    $scope.notVoted = false;
    QuestStorage.getRating($scope.questId, $scope.rating);
    console.log($scope.rating);
    var max = 5;
    var ratearray = [];
    if($scope.rating === "") {
       $scope.rating = 1;
     }
  }

  $scope.queueQuest = function(){
    QuestStorage.queueQuest($scope.questId, $scope.token)
    .then(function(resp){
      $location.path('/profile');
    })
    .catch(function(error){
      console.log(error);
    })
  };

  $scope.range = function(n) {
    return new Array(n);
  };

  var sessionCheck = function(){
    if(!Auth.isAuth()){
      $location.path('/signin')
    }
  };

  // sessionCheck();
});

