'use strict';
var app = angular.module('greenex', ['appNav', 'ngRoute', 'userControllers', 'plantControllers', 'appServices', 'toaster', 'miscStuff'])
.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
		.when('/users', {
			templateUrl: '/partials/userIndex',
			controller: 'UserIndexCtrl'
		})
		.when('/users/new', {
			templateUrl: '/partials/userForm',
			controller: 'UserNewCtrl'
		})
		.when('/users/:id', {
			templateUrl: '/partials/userShow',
			controller: 'UserShowCtrl'
		})
		.when('/users/:id/edit', {
			templateUrl: '/partials/userForm',
			controller: 'UserEditCtrl'
		})
		.when('/plants', {
			templateUrl: '/partials/plantIndex',
			controller: 'PlantIndexCtrl'
		})
		.when('/plants/new', {
			templateUrl: '/partials/plantForm',
			controller: 'PlantNewCtrl'
		})
		.when('/plants/:id', {
			templateUrl: '/partials/plantShow',
			controller: 'PlantShowCtrl'
		})
		.when('/plants/:plant/lots', {
			templateUrl: '/partials/plantLotsIndex',
			controller: 'PlantLotsIndexCtrl'
		})
		.when('/plants/:plant/lots/new', {
			templateUrl: '/partials/plantLotsNew',
			controller: 'PlantLotsNewCtrl'
		})
		.when('/plants/:plant/lots/:lot/outs', {
			templateUrl: '/partials/plantLotsOutsIndex',
			controller: 'PlantLotsOutsIndexCtrl'
		})
		.when('/plants/:plant/lots/:lot/outs/new', {
			templateUrl: '/partials/plantLotsOutsNew',
			controller: 'PlantLotsOutsNewCtrl'
		})
		.when('/plants/:id/edit', {
			templateUrl: '/partials/plantForm',
			controller: 'PlantEditCtrl'
		})
		.when('/login', {
			templateUrl: '/partials/login',
			controller: 'LoginCtrl'
		})
		.when('/', {controller: 'rootCtrl', template: ''})
		.otherwise({redirectTo: '/'});
	}
])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
}])
