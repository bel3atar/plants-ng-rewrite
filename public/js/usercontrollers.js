'use strict';

function url_base64_decode(str) {
	var output = str.replace('-', '+').replace('_', '/');
	switch (output.length % 4) {
		case 0: break;
		case 2: output += '=='; break;
		case 3: output += '='; break;
		default: throw 'Illegal base64url string!';
	}
	return window.atob(output);
}

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
.controller('LoginCtrl', ['$scope', '$http', '$window', '$location', 'toaster', 'Session', '$rootScope',
	function ($scope, $http, $window, $loc, toaster, Session, $rootScope) {
		$scope.login = function () {
			$http
				.post('/login', $scope.user)
				.success(function (data, status, headers, config) {
					Session.set('token', data.token);
					Session.set('logged', true);
					var user = JSON.parse(url_base64_decode(data.token.split('.')[1]));	
					$rootScope.logged = true;
					Session.set('name', user.name);
					Session.set('role', user.role);
					$loc.path('/plants');
					toaster.pop('success', 'Bienvenue ', 'Vos identifiants sont autorisés');
				})
				.error(function (data, status, headers, config) {
					$rootScope.logged = false;
					Session.clr();
					Session.set('logged', false);
					toaster.pop('error', 'Erreur', "Vous n'êtes pas autorisés à accéder");
				});
		};
	}
])
