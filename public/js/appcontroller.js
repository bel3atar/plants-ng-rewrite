'use strict';
angular.module('appNav', [])
.controller('appCtrl', ['Session', '$scope', '$rootScope', 
	function (Session, $scope, $rootScope) {
		$rootScope.logged = false;
	}
])
