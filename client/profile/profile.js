angular.module('cityQuest.profile', [])

.controller('profileCtrl', function ($q, $scope, $location, $window, Profile, Auth, QuestStorage, InputConversion){

	// $scope.user = {}

	$scope.token = $window.localStorage.getItem('sessiontoken');
  $scope.showNoQuestsFoundMsg = false;
  $scope.showNoQuestsToDoFoundMsg = false;

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
    console.log('type', type);
  	QuestStorage.getAllQuestsById(questIds)
  	.then(function(data){
      data.forEach(function(quest){
        quest.time = InputConversion.minutesToHours(quest.time);
      });
      if(type === 'created'){
        $scope.quests = data;
      }
      else if(type === 'toDo'){
        $scope.questsToDo = data;
      }
  	})
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
  });

});