angular.module('cityQuest.questList', [])

.controller('questListCtrl', function($scope, $window, QuestStorage, Auth, InputConversion, $location){
  $scope.quests = null;
  $scope.showNoQuestsFoundMsg = false;
  $scope.signedIn = false;
  $scope.currCity = InputConversion.capitalizeFirstLetter($window.localStorage.getItem('city'));
  $scope.token = $window.localStorage.getItem('sessiontoken');
  $scope.signout = function() {
    Auth.signout();
  };

  var getAllQuests = function(){
    QuestStorage.getAllQuests()
    .then(function(quests){
      var questsFound = quests.length > 0;
      if(questsFound){
        quests.forEach(function(quest){
          quest.time = InputConversion.minutesToHours(quest.time);
        });
        $scope.quests = quests;
      }
      else{
        $scope.showNoQuestsFoundMsg = true;
      }
    })
    .catch(function(error){
      console.log(error);
    });
  };

  $scope.queueQuest = function(questId){
    QuestStorage.queueQuest(questId, $scope.token)
    .then(function(resp){
      console.log('resp', resp)
    })
    .catch(function(error){
      console.log(error);
    })
  };

  var sessionCheck = function(){
    if(!Auth.isAuth()){
      $scope.signedIn = false;
    }
    else{
      $scope.signedIn = true;
    }
  };

  sessionCheck();
  getAllQuests();
});
