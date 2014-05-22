'use strict';

angular.module('userControllers', [])

.controller('UserIndexCtrl', ['$scope', 'User',
	function ($scope, User) {
		$scope.users = User.query();
		$scope.delete = function (uid) {
			User.delete({id: uid}, function () {
				$scope.users = User.query();
			});
			console.log('delete' + uid);
		};
	}
])
.controller('UserNewCtrl', ['$scope', 'User', '$location',
	function ($scope, User, $location) {
		$scope.btnCaption = 'Ajouter';
		$scope.user = {role: 'Client'};
		$scope.save = function () {
			User.save({id: $scope.id}, $scope.user, function () {
				$location.path('/users');
			});
		};
	}
])
.controller('UserEditCtrl', ['$scope', 'User', '$location', '$routeParams',
	function ($scope, User, $location, $rps) {
		$scope.btnCaption = 'Modifier';
		$scope.user = User.query({id: $rps.id});
		$scope.save = function () {
			User.save({id: $scope.id}, $scope.user, function () {
				$location.path('/users');
			});
		};
	}
])
