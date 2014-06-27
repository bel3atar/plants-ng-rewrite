'use strict';

angular.module('packageControllers', ['angularFileUpload'])

.controller('PackageNewCtrl', ['$scope', 'Package', '$upload', '$location',
	function ($scope, Package, $upload, $location) {
		$scope.btnCaption = 'Ajouter';
		$scope.file = null;
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/api/packages',
				data: $scope.package, 
				file: $scope.file
			}).success(function () {
				$location.replace('/packages');
			});
		};
	}
])
.controller('PackageEditCtrl', ['$routeParams', '$scope', 'Package',
	function ($params, $scope, Package) {
		$scope.btnCaption = 'Modifier';
		$scope.package = Package.get({id: $params.id});
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/api/packages',
				mathod: 'PUT',
				data: $scope.package, 
				file: $scope.file
			}).success(function () {
				$location.replace('/packages');
			});
		};
	}
])
.controller('PackageIndexCtrl', ['$scope', 'Package', '$filter',
	function ($scope, Package, $filter) {
		function shapeData(data) {
			var ret = [], l = data.length;
			for (var i = 0; i <= l; ++i) {
				ret[i] = [];
				ret[i].push(data.splice(0, 2));
				ret[i].push(data.splice(0, 2));
			}
			return ret;
		}
		$scope.delete = function (id, name) {
			$scope.delId   = id;
			$scope.delName = name;
		};
		$scope.confirm = function () {
			Package.remove({id: $scope.delId}, function () {
				var data = Package.query(function () {
					$scope.quadruplets = shapeData($filter('orderBy')(data.packages, 'name'));
				});
				$('#deleteModal').modal('hide');
			});
		};
		var data = Package.query(function () {
			$scope.quadruplets = shapeData($filter('orderBy')(data.packages, 'name'));
		});
	}
])
