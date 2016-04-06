var app = angular.module('PartyApp', ['ui.router', 'AppCtrls', 'navbar']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/404');

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
      controller: 'HomeCtrl'
    })
    .state('bac', {
      url: '/bac',
      templateUrl: 'app/views/bac.html',
      controller: 'bacCtrl'
    })
    .state('bacResults', {
      url: '/bacresults',
      templateUrl: 'app/views/bacResults.html',
      controller: 'ResultsCtrl'
    })
    .state('newuser', {
      url: '/new',
      templateUrl: 'app/views/newUser.html',
      controller: 'SignupCtrls'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'LoginCtrl'
    })
    .state('timer', {
      url: '/timer',
      templateUrl: 'app/views/timer.html',
      controller: 'TimerCtrl'
    })
    .state('tracking', {
      url: '/tracking',
      templateUrl: 'app/views/tracking.html',
      controller: 'TrackCtrl'
    })
    .state('404', {
      url: '/404',
      templateUrl: 'app/views/404.html'
    });

    $locationProvider.html5Mode(true)
  }
]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);

// app.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
//   localStorageServiceProvider
//   .setPrefix('PartyApp')
//   .setNotify(true, true);
// }]);
