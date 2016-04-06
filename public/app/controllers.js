angular.module("AppCtrls", ['PartyServices'])

.controller('SignupCtrls', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.user = {
		username: '',
		email: '',
		password: '',
		weight: ''

	};
	$scope.userSignup = function() {
		$http.post('api/users', $scope.user).then(function success(res) {
			$location.path('/');
		}, function error(res) {
			console.log(res);
		});

	} 
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', 'User', function($scope, $http, $location, Auth, User) {
	$scope.user = {
		username: '',
		email: '',
		password: ''
	};
	$scope.userLogin = function() {
		$http.post('api/auth', $scope.user).then(function success(res) {
			Auth.saveToken(res.data.token);
			User = res.data.user;
			console.log(User.username);
			localStorage.setItem('username', User.username);
			localStorage.setItem('userweight', User.weight);
			localStorage.setItem('usergender', User.gender);

			$location.path('/')
		}, function error(res) {
			console.log(res);
		})		
	}
}])

.controller('NavCtrl', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {
  $scope.Auth = Auth;  
  // $scope.user = {
  // 	username: ''
  // };
  // $http.get('api/users', $scope.user).then()

  $scope.logout = function() {
    //to implement
    Auth.removeToken();
    $state.reload();
  }
}])

.controller('CalcCtrl', ['$scope', function() {

}])

.controller('HomeCtrl', ['$scope', function($scope) {

}])

.controller('bacCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.getBAC = function() {
		// $scope.genders = ['Male', 'Female'];
		$scope.weightInGrams = $scope.weight * 454;
		$scope.alcolholInGrams = $scope.drinks * 14;
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		$scope.bacOverTime = $scope.bac - ($scope.time * 0.015);
		console.log($scope.bacOverTime);
		localStorage.setItem('bacOverTime', $scope.bacOverTime);
	

		$location.path('/bacresults');
	}
}])
.controller('ResultsCtrl', ['$scope', function($scope) {
	$scope.bacOverTime = localStorage.getItem('bacOverTime');
}])
.controller('TrackCtrl', ['$scope', 'User','$filter', function($scope, User, $filter) {
	$scope.drinktracking = [];
	$scope.beercounter = 0;
	$scope.winecounter = 0;
	$scope.cocktailcounter = 0;
	$scope.username = localStorage.getItem('username');
	// User = res.data.user;
	// $scope.user = User
	$scope.startTracker = function() {
		$scope.startTime = $filter('date')(new Date(), 'EEEE h:mm a');
		$scope.startMathTime = Date.parse(new Date());
		console.log($scope.startMathTime);
	}
	$scope.addBeer = function() {
		$scope.beercounter++;
	}
	$scope.addWine = function() {
		$scope.winecounter++;	
	}
	$scope.addCocktail = function() {
		$scope.cocktailcounter++;	
		// console.log($scope.startTime);

	}
	$scope.calcNewBac = function() {
		$scope.gender = localStorage.getItem('usergender');
		$scope.weight = localStorage.getItem('userweight');
		$scope.calcTime = Date.parse(new Date());
		console.log($scope.calcTime);
		$scope.weightInGrams = $scope.weight * 454;
		console.log($scope.weightInGrams);
		console.log($scope.gender);
		$scope.alcolholInGrams = ($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) * 14;
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		$scope.bacTracking = $scope.bac - (($scope.calcTime -$scope.startMathTime)  * 0.015);
		console.log($scope.bacTracking);
		localStorage.setItem('bacTracking', $scope.bacTracking);
		}
	
}])
.controller('TimerCtrl', ['$scope', '$interval', '$filter', function($scope, $interval, $filter) {
	$scope.time = $filter('date')(new Date(), 'HH:mm:ss');
	$scope.newTime = $scope.time + $filter('date')('00:01:00');
	$scope.startTimer = function() {
		$scope.Timer = 60;

		$scope.Message = "Timer started. ";
		$scope.intervalId = $interval(function() {
			$scope.Timer--
		}, 1000)
	}
	$scope.StopTimer = function () {

        //Set the Timer stop message.
        $scope.Message = "Timer stopped.";

        //Cancel the Timer.
        if (angular.isDefined($scope.intervalId)) {
            $interval.cancel($scope.intervalId);
        }
    };

}]);









