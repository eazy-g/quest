angular.module('cityQuest.profile', [])

.controller('profileCtrl', function ($q, $scope, $location, $window, Profile, Auth, QuestStorage, InputConversion){

	$scope.token = $window.localStorage.getItem('sessiontoken');
  $scope.showNoQuestsFoundMsg = false;
  $scope.showNoQuestsToDoFoundMsg = false;
  $scope.showNoQuestsCompletedFoundMsg = false;

	var getProfile = function(){
		var deferred = $q.defer();
		Profile.getProfile($scope.token)
		.then(function(data){
			$scope.profile = data.profile;
			deferred.resolve();
			// console.log('$scope.profile', $scope.profile);
		});
		return deferred.promise;
	};

	var getAllQuestsById = function(questIds, type){
  	QuestStorage.getAllQuestsById(questIds)
  	.then(function(data){
      if(data){
        data.forEach(function(quest){
          quest.time = InputConversion.minutesToHours(quest.time);
        });
      }
      if(type === 'created'){
        $scope.createdQuests = data;
      }
      else if(type === 'toDo'){
        $scope.questsToDo = data;
      }
      else if(type === 'completed'){
        $scope.completedQuests = data;
      }
  	})
  };

  $scope.completeQuest = function(questId){
    Profile.completeQuest(questId, $scope.token)
    .then(function(data){
      console.log('data', data);
    })
    console.log('questId', questId);
  };

  var sessionCheck = function(){
    if( ! Auth.isAuth()) {
      $location.path('/signin');
    }
  };



  sessionCheck();
  getProfile()
  .then(function(){
    if($scope.profile.created_quests_ids.length > 0){
      getAllQuestsById($scope.profile.created_quests_ids, 'created');
    }
    else{
      $scope.showNoQuestsToDoFoundMsg = true;
    }
    if($scope.profile.quests_to_do_ids.length > 0){
      getAllQuestsById($scope.profile.quests_to_do_ids, 'toDo');
    }
    else{
      $scope.showNoQuestsToDoFoundMsg = true;
    }
    if($scope.profile.completed_quests.length > 0){
      var completedQuestsArray = [];
      $scope.profile.completed_quests.forEach(function(quest){
        completedQuestsArray.push(quest.quest_id);
      });
      getAllQuestsById(completedQuestsArray, 'completed');
    }
    else{
      $scope.showNoQuestsCompletedFoundMsg = true;
    }
  });

});