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

