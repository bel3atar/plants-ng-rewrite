'use strict';
function isEmpty(value) {
	return angular.isUndefined(value) || value === '' || value === null || value !== value;
}
angular.module('miscStuff', [])
.controller('rootCtrl', ['$location', '$window',
	function ($location, $window) {
		if ($window.sessionStorage.token)
			$location.path('/plants');
		else
			$location.path('/login');
	}
])
.factory('authInterceptor', ['$rootScope', '$q', '$window', '$location',
	function ($rootScope, $q, $window, $location) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token)
					config.headers.Authorization = 
						'Bearer ' + $window.sessionStorage.token;
				return config;
			},
			responseError: function (rejection) {
				return $q.reject(rejection);
			}
		};
	}
])
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
