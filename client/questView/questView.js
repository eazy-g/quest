angular.module('cityQuest.questView', [])

.controller('questViewCtrl', function($scope, $routeParams, $window, QuestStorage, uiGmapGoogleMapApi, Auth, InputConversion){
  $scope.questId = $routeParams.questId;

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

  $scope.rate = function(rating) {
   console.log('RATED', rating);

  }

  // give scopequestid and rating for post request to be stored in DB

  var sessionCheck = function(){
    if(!Auth.isAuth()){
      $location.path('/signin')
    }
  };

  // sessionCheck();
});

