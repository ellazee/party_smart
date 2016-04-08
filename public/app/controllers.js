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
			$location.path('/login');
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

.controller('bacCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
	$scope.Auth = Auth;
	$scope.drunk = false;
	$scope.notdrunk = false;
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
		$scope.bacOverTime = (($scope.bac - ($scope.time * 0.015)).toFixed(3));
		console.log($scope.bacOverTime);
		localStorage.setItem('bacOverTime', $scope.bacOverTime);
	

		$location.path('/bacresults');
	}
	$scope.lgGetBAC = function() {
		$scope.gender = localStorage.getItem('usergender');
		$scope.weight = parseInt(localStorage.getItem('userweight'));
		$scope.calcTime = Date.parse(new Date());
		$scope.weightInGrams = $scope.weight * 454;
		$scope.alcolholInGrams = $scope.drinks * 14;
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		// console.log("BAC is "+ $scope.bac);
		if ($scope.alcolholInGrams == 0) {
			$scope.bacTracking = "You Haven't Even Had Any Drinks Yet!!!";
		} else {
		$scope.bacOverTime = (($scope.bac - ($scope.time * 0.015)).toFixed(3));
		}
		console.log($scope.bacOverTime);
		localStorage.setItem('bacOverTime', $scope.bacOverTime);
		$location.path('/bacresults');
		}
		
}])
.controller('ResultsCtrl', ['$scope', function($scope) {
	$scope.bacOverTime = localStorage.getItem('bacOverTime');
	if ($scope.bacOverTime >= .08) {
			$scope.drunk = true;
			$scope.message = "No Driving!"
		} else {
			$scope.message = "Please Drive Safe. Consider taking Lyft."
			$scope.notdrunk = true;
		} 

}])
.controller('TrackCtrl', ['$scope', 'User','$filter', 'Auth', function($scope, User, $filter, Auth) {
	$scope.Auth = Auth;
	$scope.beercounter = parseInt(localStorage.getItem('beercount')) || 0;
	$scope.winecounter = parseInt(localStorage.getItem('winecount')) || 0;
	$scope.cocktailcounter = parseInt(localStorage.getItem('cocktailcount')) || 0;
	$scope.username = localStorage.getItem('username');
	$scope.displayStart = localStorage.getItem('displayStartTime') || null;
	$scope.formulaStart = localStorage.getItem('mathStartTime') || null;
	localStorage.setItem('bacTracking', $scope.bacTracking) || null;

	$scope.trackerOn = false;

	// User = res.data.user;
	// $scope.user = User
	$scope.startTracker = function() {
		$scope.startTime = $filter('date')(new Date(), 'EEEE h:mm a');
		$scope.startMathTime = Date.parse(new Date());
		localStorage.setItem('displayStartTime', $scope.startTime);
		localStorage.setItem('mathStartTime', $scope.startMathTime);
		$scope.trackerOn = true;
	}
	$scope.keepTracking = function() {
		$scope.trackerOn = true;
	}
	if (($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) > 0) {
		console.log("Already beer-ed");
		$scope.keepTracking();
	}
	$scope.addBeer = function() {
		$scope.beercounter++;
		localStorage.setItem('beercount', $scope.beercounter);
	}
	$scope.addWine = function() {
		$scope.winecounter++;	
		localStorage.setItem('winecount', $scope.winecounter);
	
	}
	$scope.addCocktail = function() {
		$scope.cocktailcounter++;	
		localStorage.setItem('cocktailcount', $scope.cocktailcounter);
	

	}
	$scope.calcNewBac = function() {
		$scope.gender = localStorage.getItem('usergender');
		$scope.weight = localStorage.getItem('userweight');
		$scope.calcTime = Date.parse(new Date());
		$scope.weightInGrams = $scope.weight * 454;
		$scope.alcolholInGrams = ($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) * 14;
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		$scope.hoursPassed = (($scope.calcTime - $scope.formulaStart)/(60000))/60;
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		// console.log("BAC is "+ $scope.bac);
		if ($scope.alcolholInGrams == 0) {
			$scope.bacTracking = "You Haven't Even Had Any Drinks Yet!!!";
		} else {
		$scope.bacTracking = (($scope.bac - ($scope.hoursPassed * 0.015)).toFixed(3));
		}
		console.log($scope.bacTracking);
		localStorage.setItem('bacTracking', $scope.bacTracking);
		
		$scope.showBAC = true;
		}
	$scope.reset = function() {
		$scope.trackerOn = false;
		localStorage.removeItem('beercount');
		localStorage.removeItem('winecount');
		localStorage.removeItem('cocktailcount');
		window.location.reload();

	}	
	
}])
.controller('TimerCtrl', ['$scope', '$filter', 'Auth', function($scope, $filter, Auth) {
	$scope.Auth = Auth;  
	$scope.beercounter = parseInt(localStorage.getItem('beercount')) || 0;
	$scope.winecounter = parseInt(localStorage.getItem('winecount')) || 0;
	$scope.cocktailcounter = parseInt(localStorage.getItem('cocktailcount')) || 0;
	$scope.displayStart = localStorage.getItem('displayStartTime') || null;
	$scope.formulaStart = localStorage.getItem('mathStartTime') || null;
	$scope.totalDrinks = $scope.beercounter + $scope.winecounter + $scope.cocktailcounter;
	$scope.bac = localStorage.getItem('currentBac') || localStorage.getItem('bacTracking') || ("Zip!!");
	
	$scope.calcCurrentBac = function() {
		$scope.gender = localStorage.getItem('usergender');
		$scope.weight = localStorage.getItem('userweight');
		$scope.calcTime = Date.parse(new Date());
		$scope.weightInGrams = $scope.weight * 454;
		$scope.alcolholInGrams = ($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) * 14;
		if($scope.gender == 'female') {
			$scope.genderConstant = $scope.weightInGrams * .55
			} else {
			$scope.genderConstant =	$scope.weightInGrams * .68
			};
		$scope.hoursPassed = ((($scope.calcTime - $scope.formulaStart)/(60000))/60).toFixed(1);
		$scope.bac = ($scope.alcolholInGrams/$scope.genderConstant) * 100;
		// console.log("BAC is "+ $scope.bac);
		if ($scope.alcolholInGrams == 0) {
			$scope.bacTracking = "You Haven't Even Had Any Drinks Yet!!!";
		} else {
		$scope.bacTracking = (($scope.bac - ($scope.hoursPassed * 0.015)).toFixed(3));
		}
		console.log($scope.bacTracking);
		if ($scope.bacTracking < .08) {
			$scope.hoursToWait = "You're good. Please Drive Safe.";	
		} else if ($scope.bacTracking < .12) {
				$scope.hoursToWait = 1;
			} else if ($scope.bacTracking < .2) {
				$scope.hoursToWait = 2;
			}
			// localStorage.setItem('hoursToWait', $scope.hoursToWait);
		}
		// localStorage.setItem('currentBac', $scope.bacTracking);
	
	
	if (($scope.beercounter + $scope.winecounter + $scope.cocktailcounter) > 0) {
		console.log("Already beer-ed");
		$scope.calcCurrentBac();
	}
}]);









