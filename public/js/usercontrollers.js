'use strict';

angular.module('userControllers', [])

.controller('UserNewCtrl', ['$scope', 'User',
	function ($scope, User) {
		$scope.btnCaption = 'Ajouter';
		$scope.save = function () {
			User.save({id: $scope.id});
		};
	}
])
