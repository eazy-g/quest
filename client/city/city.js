angular.module('cityQuest.city', [])

.controller('cityCtrl', function($scope, $location, $window, QuestStorage, InputConversion, Auth){
  $scope.city = "";
  $scope.signedIn = !!$window.localStorage.getItem('sessiontoken');

  $scope.signout = function(){
    Auth.signout();
  };

  $scope.citySelect = function(){
    QuestStorage.saveCity($scope.city.toLowerCase());
    $location.path('/questList');
  };

  //This will be refactored later to get two random, top rated quests
  var getTwoRandomQuests = function(){
    QuestStorage.getAllQuests()
    .then(function(quests){
      var questsFound = quests.length > 0;
      if(questsFound){
        quests.forEach(function(quest){
          quest.time = InputConversion.minutesToHours(quest.time);
        });
        $scope.quests = quests;
      }else{
        $scope.showNoQuestsFoundMsg = true;
      }
    })
    .catch(function(error){
      console.log(error);
    });
  }

  // var sessionCheck = function(){
  //   if( ! Auth.isAuth()) {
  //     $location.path('/signin');
  //   }
  // }

  // sessionCheck();
  getTwoRandomQuests();
  $window.localStorage.removeItem('city');
  $window.localStorage.removeItem('coords');
});
