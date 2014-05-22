'use strict';
function isEmpty(value) {
	return angular.isUndefined(value) || value === '' || value === null || value !== value;
}
var app = angular.module('greenex', ['ngRoute', 'userControllers', 'plantControllers', 'appServices'])
.directive('ngMax', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMax, function () {
					ctrl.$setViewValue(ctrl.$viewValue);
			});
			var maxValidator = function(value) {
				var max = scope.$eval(attr.ngMax) || Infinity;
				if (!isEmpty(value) && value > max) {
					ctrl.$setValidity('ngMax', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMax', true);
					return value;
				}
			};
			ctrl.$parsers.push(maxValidator);
			ctrl.$formatters.push(maxValidator);
		}
	};
})
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
		.otherwise({redirectTo: '/plants'});
	}
])
.directive('madmax', function () {
	return function (scope, element) {
		console.log(element);
	};
});