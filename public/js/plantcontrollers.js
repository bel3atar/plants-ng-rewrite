'use strict';

angular.module('plantControllers', ['angularFileUpload'])

.controller('PlantNewCtrl', ['$scope', 'Plant', '$upload', '$location',
	function ($scope, Plant, $upload, $location) {
		$scope.btnCaption = 'Ajouter';
		$scope.file = null;
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/plants',
				data: $scope.plant, 
				file: $scope.file
			}).success(function () {
				$location.path('/plants');
			});
		};
	}
])
.controller('PlantEditCtrl', ['$routeParams', '$scope', 'Plant',
	function ($params, $scope, Plant) {
		$scope.btnCaption = 'Modifier';
		$scope.plant = Plant.get({id: $params.id});
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/plants',
				mathod: 'PUT',
				data: $scope.plant, 
				file: $scope.file
			}).success(function () {
				$location.path('/plants');
			});
		};
	}
])
.controller('PlantShowCtrl', ['$routeParams', '$scope', 'Plant',
	function ($params, $scope, Plant) {
		$scope.plant = Plant.get({id: $params.id});
	}
])
.controller('PlantIndexCtrl', ['$scope', 'Plant', '$filter',
	function ($scope, Plant, $filter) {
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
			Plant.remove({id: $scope.delId}, function () {
				var data = Plant.query(function () {
					$scope.quadruplets = shapeData($filter('orderBy')(data.plants, 'name'));
				});
				$('#deleteModal').modal('hide');
			});
		};
		var data = Plant.query(function () {
			$scope.quadruplets = shapeData($filter('orderBy')(data.plants, 'name'));
		});
	}
])
.controller('PlantLotsIndexCtrl', ['$routeParams', '$scope', 'Plant', '$location',
	function ($params, $scope, Plant, $location) {
		$scope.setLotId = function (id) {
			$location.path('/plants/' + $params.plant + '/lots/' + id + '/outs');
		};
		var data = Plant.query({id: $params.plant, action: 'lots'}, function () {
			$scope.plant = {name: data.name, id: data.id};
			data.lots.forEach(function (lot) {
				var sum = .0;
				for (var i = 0; i < lot.outs.length; ++i)
					sum += lot.outs[i].raw;
				lot.remaining = lot.quantity - sum;
			});
			$scope.lots  = data.lots;
		});
	}
])

.controller('PlantLotsNewCtrl', ['$routeParams', '$scope', 'Plant',
	function ($params, $scope, Plant) {
		$scope.add = function () {
			Plant.save({id: $params.plant, action: 'lots'}, $scope.lot, function () {
				$loc.path('/plants/' + $params.plant + '/lots');
			});
		};
	}
])

.controller('PlantLotsOutsIndexCtrl', ['$routeParams', '$scope', 'Lot',
	function ($params, $scope, Lot) {
		var data = Lot.query({lot: $params.lot, action: 'outs'}, function () {
			$scope.lot = {
				plantname: data.name,
				plantid: data._id,
				date: data.lots[0].date,
				id: data.lots[0]._id
			}
			$scope.outs = data.lots[0].outs;
		});
	}
])
.controller('PlantLotsOutsNewCtrl', [
	'Lot',
	'$routeParams',
 	'$scope',
	'$location',
	function (Lot, $rps, $scope, $loc) {
		$scope.lot = Lot.query({lot: $rps.lot});
		$scope.save = function () {
			console.log($rps);
			Lot.save({lot: $rps.lot, action: 'outs'}, $scope.out, function () {
				console.log($loc);
				$loc.path('/plants/' + $rps.plant + '/lots/' + $rps.lot + '/outs');			
			});
		};
	}
])
