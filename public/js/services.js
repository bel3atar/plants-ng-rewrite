'use strict';
angular.module('appServices', ['ngResource'])
.factory('Package', ['$resource',
	function ($resource) {
		return $resource(
			'/api/packages/:id/:action', 
			{id: '@id', action: '@action'},
			{query: {isArray: false}, update: {method: 'PUT'}}
		);
	}
])
.factory('Plant', ['$resource',
	function ($resource) {
		return $resource(
			'/api/plants/:id/:action', 
			{id: '@id', action: '@action'},
			{query: {isArray: false}, update: {method: 'PUT'}}
		);
	}
])
.factory('Final', ['$resource',
	function ($resource) {
		return $resource(
			'/api/finals/:final/:action',
			{final: '@final', action: '@action'}
		);
	}
])
.factory('Out', ['$resource',
	function ($resource) {
		return $resource(
			'/api/outs/:out/:action',
			{out: '@out', action: '@action'},
			{query: {isArray: false}}
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
			get: function (key) { return $window.sessionStorage[key];   },
			set: function (k,v) { $window.sessionStorage[k] = v;        },
			clr: function ()    { $window.sessionStorage.clear();       },
			on : function ()    { return $window.sessionStorage.logged; }
		};
	}
])
.factory('Socket', ['socketFactory', function (sf) {
	return sf();
}])
