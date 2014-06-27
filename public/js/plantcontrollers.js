'use strict';

angular.module('plantControllers', ['angularFileUpload'])

.controller('PlantNewCtrl', ['$scope', 'Plant', '$upload', '$location',
	function ($scope, Plant, $upload, $location) {
		$scope.btnCaption = 'Ajouter';
		$scope.file = null;
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/api/plants',
				data: $scope.plant, 
				file: $scope.file
			}).success(function () {
				$location.path('/plants');
				$location.replace();
			});
		};
	}
])
.controller('PlantEditCtrl', ['$routeParams', '$scope', 'Plant', '$upload',
	function ($params, $scope, Plant, $upload) {
		$scope.btnCaption = 'Modifier';
		$scope.plant = Plant.get({id: $params.id});
		$scope.getFile = function (file) { $scope.file = file; };
		$scope.save = function () {
			$upload.upload({
				url: '/api/plants/' + $params.id,
				method: 'PUT',
				data: $scope.plant, 
				file: $scope.file
			}).success(function () {
				$location.path('/plants');
				$location.replace();
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
.controller('PlantLotsIndexCtrl', ['$routeParams', '$scope', 'Plant', '$location', 'Socket',
	function ($params, $scope, Plant, $location, Socket) {
		Socket.forward('newLot', $scope);
		$scope.$on('socket:newLot', function (ev, lot) {
			lot.remaining = lot.quantity;
			for (var i = 0; i < $scope.lots.length; ++i)
				if ($scope.lots[i]._id === lot._id) 
					break;
			if (i === $scope.lots.length) $scope.lots.push(lot);
		});

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

.controller('PlantLotsNewCtrl', ['$routeParams', '$scope', 'Plant', '$location',
	function ($params, $scope, Plant, $loc) {
		$scope.add = function () {
			Plant.save({id: $params.plant, action: 'lots'}, $scope.lot, function () {
				$loc.path('/plants/' + $params.plant + '/lots');
			});
		};
	}
])

.controller('PlantLotsOutsIndexCtrl', ['$routeParams', '$scope', 'Lot', '$location',
	function ($params, $scope, Lot, $location) {
		var data = Lot.query({lot: $params.lot, action: 'outs'}, function () {
			$scope.lot = {
				plantname: data.name,
				plantid: data._id,
				date: data.lots[0].date,
				id: data.lots[0]._id
			}
			$scope.outs = data.lots[0].outs;
			$scope.go = function (id) {
				$location.path(
					'/plants/' + $params.plant + '/lots/' + $params.lot + '/outs/'
					+ id + '/finals'
				);
			};
		});
	}
])
.controller('PlantLotsOutsFinalsNewCtrl', ['Out', '$routeParams', '$scope', '$location', 'Package',
	function (Out, $rps, $scope, $location, Package) {
		$scope.final = {};
		$scope.outId = $rps.out;
		var packs = Package.query(function () {
			$scope.packages = packs.packages; 
			$scope.final.package = packs.packages[0];
		});
		$scope.save = function () {
			Out.save({out: $rps.out, action: 'finals'}, $scope.final, function () {
				$location.path(
					'/plants/' + $rps.plant + '/lots/' + $rps.lot + '/outs/' + $rps.out + '/finals');			
				$location.replace();
			});
		};
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
.controller('PlantLotsOutsFinalsIndexCtrl', ['Out', '$routeParams', '$scope', '$location', 'Final',
	function (Out, $rps, $scope, $location, Final) {
		$scope.sell = function (id, quantity) {
			console.log($('#myModal').modal());
			$scope.gonnasell = id;
			$("#howmuch").attr('max', quantity);
		};
		$scope.dosell = function () {
			Final.save(
				{final: $scope.gonnasell, action: 'sell'},
				{howmuch: $scope.howmuch},
				function () {
					$('#myModal').modal('hide');
					var data = Out.query({out: $rps.out, action: 'finals'}, function () {
						$scope.data = data;
					});
				}
			);
		};
		var data = Out.query({out: $rps.out, action: 'finals'}, function () {
			$scope.data = data;
		});
	}
])
