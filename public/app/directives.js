
angular.module('navbar', []).directive('navbar', function() {
	return {
	restrict: 'E',
	templateUrl: 'app/views/partials/navbar.html',
	}
});

angular.module('footer', []).directive('footer', function() {
	return {
	restrict: 'E',
	templateUrl: 'app/views/partials/footer.html',
	}
});
