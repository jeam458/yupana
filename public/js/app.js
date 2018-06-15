


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap',
  'ngTable',
  ]).
config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.when('/principal', {templateUrl: 'partials/principal.html', controller: 'principalCtrl'});
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
  $routeProvider.when('/records', {templateUrl: 'partials/records.html', controller: 'RecordsCtrl'});
  $routeProvider.when('/etnobotacias', {templateUrl: 'partials/etnobotanica.html', controller: 'EtnobotaciasCtrl'});
  $routeProvider.when('/transectos',{templateUrl:'partials/transecto.html',controller:'TransectosCtrl'});
  $routeProvider.when('/agre_etno', {templateUrl: 'partials/agre_etno.html', controller: 'EtnobotaciasCtrl'});
  $routeProvider.when('/setup', {templateUrl: 'partials/setup.html', controller: 'SetUpCtrl',abstract: true});
  $routeProvider.when('/especies',{templateUrl:'partials/especies1.html',controller: 'especiesctrl'});
  $routeProvider.when('/partesUsadas',{templateUrl:'partials/partesusadas.html',controller: 'parteusadactrl'});
  $routeProvider.when('/formasuso',{templateUrl:'partials/formasuso.html',controller: 'formasusoctrl'});
  $routeProvider.when('/tiposvegetacion',{templateUrl:'partials/tiposvegetacion.html',controller: 'tipovegetacionctrl'});
  $routeProvider.when('/formasbiologicas',{templateUrl:'partials/formasbiologicas.html',controller: 'formabiologicactrl'});
  $routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UserCtrl'});
  $routeProvider.when('/reports/transactions', {templateUrl: 'partials/transaction_reports.html', controller: 'TransactionReportsCtrl'});
  $routeProvider.when('/reports/stock', {templateUrl: 'partials/stock_reports.html', controller: 'StockReportsCtrl'});
  $routeProvider.otherwise({redirectTo: '/etnobotacias'});
  $routeProvider.when('/logout', {templateUrl: 'partials/login.html', controller: 'LogoutCtrl'});
  $httpProvider.interceptors.push(function($rootScope, $location, $q) {
    return {
      'request': function(request) {
        // if we're not logged-in to the AngularJS app, redirect to login page
         //console.log('root username '+$rootScope.username)
         //console.log('root loggedIn '+$rootScope.loggedIn)
        $rootScope.loggedIn = $rootScope.loggedIn || $rootScope.username;
        if (!$rootScope.loggedIn && $location.path() != '/login') {
          $location.path('/principal');      
        }
        return request;
      },
      'responseError': function(rejection) {
        // if we're not logged-in to the web service, redirect to login page
        if (rejection.status === 401 && $location.path() != '/login') {
          console.log('angular rejected request');
          $rootScope.loggedIn = false;
          $location.path('/login');
        }
        return $q.reject(rejection);         
      }
    };
  });
}]);
