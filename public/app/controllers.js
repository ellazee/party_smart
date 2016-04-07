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
	$scope.hideOnLoggedIn = true;

	$scope.user = {
		username: '',
		email: '',
		password: ''
	};
	$scope.userLogin = function() {
		// $scope.hideOnLoggedIn = false;
		$http.post('api/auth', $scope.user).then(function success(res) {
			Auth.saveToken(res.data.token);
			User = res.data.user;
			console.log(User.username);
			localStorage.setItem('username', User.username);
			localStorage.setItem('userweight', User.weight);
			localStorage.setItem('usergender', User.gender);
			localStorage.setItem('useremail', User.email);

			$location.path('/')
		}, function error(res) {
			console.log(res);
		})		
	}
}])

.controller('NavCtrl', ['$scope', 'Auth', '$state', '$location', function($scope, Auth, $state, $location) {
  $scope.Auth = Auth;  
  $scope.username = localStorage.getItem('username');
  // $scope.user = {
  // 	username: ''
  // };
  // $http.get('api/users', $scope.user).then()

  $scope.logout = function() {
    //to implement
    Auth.removeToken();
    localStorage.clear();
    $location.path('/');
    // $state.reload();
    
    // $scope.hideOnLoggedIn = true;
  }
}])

.controller('CalcCtrl', ['$scope', function() {

}])

.controller('HomeCtrl', ['$scope', function($scope) {

}])
.controller('ProfileCtrl', ['$scope', 'User', function($scope, User) {
	$scope.username = localStorage.getItem('username');
	$scope.email = localStorage.getItem('useremail');
	$scope.weight = localStorage.getItem('userweight');
	$scope.gender = localStorage.getItem('usergender');

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
	$scope.beercounter = parseInt(localStorage.getItem('beercount')) || 0;
	$scope.winecounter = parseInt(localStorage.getItem('winecount')) || 0;
	$scope.cocktailcounter = parseInt(localStorage.getItem('cocktailcount')) || 0;
	$scope.username = localStorage.getItem('username');

	$scope.trackerOn = false;

	// User = res.data.user;
	// $scope.user = User
	$scope.startTracker = function() {
		$scope.startTime = $filter('date')(new Date(), 'EEEE h:mm a');
		$scope.startMathTime = Date.parse(new Date());
		$scope.trackerOn = true;

		console.log($scope.startMathTime);
	}
	if (($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) > 0) {
		console.log("Already beer-ed");
		$scope.startTracker();
	}
	$scope.addBeer = function() {
		$scope.beercounter++;
		localStorage.setItem('beercount', $scope.beercounter);
		// $scope.beercount = parseInt(localStorage.getItem('beercount'));
	}
	$scope.addWine = function() {
		$scope.winecounter++;	
		localStorage.setItem('winecount', $scope.winecounter);
		// $scope.winecount = parseInt(localStorage.getItem('winecount'));
	}
	$scope.addCocktail = function() {
		$scope.cocktailcounter++;	
		localStorage.setItem('cocktailcount', $scope.cocktailcounter);
		// $scope.cocktailcount = parseInt(localStorage.getItem('cocktailcount'));
		// console.log($scope.startTime);

	}
	$scope.calcNewBac = function() {
		$scope.gender = localStorage.getItem('usergender');
		$scope.weight = localStorage.getItem('userweight');
		$scope.calcTime = Date.parse(new Date());
		// $scope.beercount = localStorage.getItem('beercount');
		// $scope.winecount = localStorage.getItem('winecount');
		// $scope.cocktailcount = localStorage.getItem('cocktailcount');

		console.log("Beercount is" + $scope.beercount);
		console.log("Winecount is" + $scope.winecount);
		console.log("Cocktail count is" + $scope.cocktailcount);
		$scope.weightInGrams = $scope.weight * 454;
		console.log("User weight in grams is" + $scope.weightInGrams);
		console.log("User gender is" + $scope.gender);
		console.log($scope.beercount + $scope.winecount);
		$scope.alcolholInGrams = ($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) * 14;
		console.log("Alcohol in grams is" + $scope.alcolholInGrams);
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		// console.log("gender constant is" + $scope.genderConstant);
		// console.log("Calc time is" + $scope.calcTime);
		// console.log("Start time is" + $scope.startMathTime);
		// console.log("Math of time is " + ($scope.calcTime - $scope.startMathTime));
		// console.log("In minutes: "+ ($scope.calcTime - $scope.startMathTime)/(60000));
		// console.log("Hours passed: "+ (($scope.calcTime - $scope.startMathTime)/(60000))/60);
		$scope.hoursPassed = (($scope.calcTime - $scope.startMathTime)/(60000))/60;
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		// console.log("BAC is "+ $scope.bac);
		$scope.bacTracking = $scope.bac - ($scope.hoursPassed * 0.015);
		// console.log($scope.bacTracking);
		localStorage.setItem('bacTracking', $scope.bacTracking);
		$scope.showBAC = true;
		}
	$scope.reset = function() {
		$scope.trackerOn = false;
		window.location.reload();
	}	
	
}])
.controller('TimerCtrl', ['$scope', '$filter', function($scope, $filter) {
	// $scope.time = $filter('date')(new Date(), 'HH:mm:ss');
	// $scope.newTime = $scope.time + $filter('date')('00:01:00');
	// $scope.startTimer = function() {
	// 	$scope.Timer = 60;

	// 	$scope.Message = "Timer started. ";
	// 	$scope.intervalId = $interval(function() {
	// 		$scope.Timer--
	// 	}, 1000)
	// }
	// $scope.StopTimer = function () {

 //        //Set the Timer stop message.
 //        $scope.Message = "Timer stopped.";

 //        //Cancel the Timer.
 //        if (angular.isDefined($scope.intervalId)) {
 //            $interval.cancel($scope.intervalId);
 //        }
 //    };

}]);









