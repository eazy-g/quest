angular.module('cityQuest.profile', [])

.controller('profileCtrl', function ($scope, $location, $window, Profile, Auth){

	// $scope.user = {}

	$scope.token = $window.localStorage.getItem('sessiontoken');

	var getProfile = function(){
		Profile.getProfile($scope.token)
		.then(function(data){
			$scope.profile = data.profile;
			console.log('$scope.profile', $scope.profile);
		});
	};

  var sessionCheck = function(){
    if( ! Auth.isAuth()) {
      $location.path('/signin');
    }
  }

  sessionCheck();
  getProfile();

});