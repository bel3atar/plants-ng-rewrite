'use strict';
angular.module('appNav', [])
.controller('navCtrl', ['Session', '$scope',
	function (Session, $scope) {
		$scope.username = Session.get('name');
	}
])
