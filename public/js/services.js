'use strict';
angular.module('appServices', ['ngResource'])
.factory('Plant', ['$resource',
	function ($resource) {
		return $resource(
			'/plants/:id/:action', 
			{id: '@id', action: '@action'},
			{query: {isArray: false}, update: {method: 'PUT'}}
		);
	}
])
.factory('Lot', ['$resource',
	function ($resource) {
		return $resource(
			'/lots/:lot/:action',
			{lot: '@lot', action: '@action'},
			{query: {isArray: false}}
		);
	}
])
.factory('User', ['$resource',
	function ($resource) {
		return $resource('/users/:id', {id: '@id'}, {update: {method: 'PUT'}});
	}
])

