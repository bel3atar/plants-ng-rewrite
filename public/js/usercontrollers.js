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
		$scope.user = User.get({id: $rps.id});
		$scope.save = function () {
			console.log('updating ' + $scope.user._id);
			User.update({id: $scope.user._id}, {
				name: $scope.user.name,
				role: $scope.user.role,
				password: $scope.user.password
			}, function () {
				$location.path('/users');
			});
		};
	}
])
.controller('LoginCtrl', ['$scope', '$http', '$window', '$location', 'toaster',
	function ($scope, $http, $window, $loc, toaster) {
		$scope.login = function () {
			$http
				.post('/login', $scope.user)
				.success(function (data, status, headers, config) {
					$window.sessionStorage.token = data.token;
					$loc.path('/');
					toaster.pop('success', 'Bienvenue ', 'Texte');
				})
				.error(function (data, status, headers, config) {
					delete $window.sessionStorage.token;
					toaster.pop('error', 'Erreur', "Vous n'êtes pas autorisés à accéder");
				});
		};
	}
])
