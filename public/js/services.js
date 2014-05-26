'use strict';
angular.module('appServices', ['ngResource'])
.factory('Plant', ['$resource',
	function ($resource) {
		return $resource(
			'/api/plants/:id/:action', 
			{id: '@id', action: '@action'},
			{query: {isArray: false}, update: {method: 'PUT'}}
		);
	}
])
.factory('Lot', ['$resource',
	function ($resource) {
		return $resource(
			'/api/lots/:lot/:action',
			{lot: '@lot', action: '@action'},
			{query: {isArray: false}}
		);
	}
])
.factory('User', ['$resource',
	function ($resource) {
		return $resource('/api/users/:id', {id: '@id'}, {update: {method: 'PUT'}});
	}
])
.factory('Session', ['$window',
	function ($window) {
		return {
			get: function (key) { return $window.sessionStorage[key]; },
			set: function (k,v) { $window.sessionStorage[k] = v;      },
			clr: function ()    { $window.sessionStorage.clear();     }
		};
	}
])

