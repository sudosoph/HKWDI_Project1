'use strict';

angular.module('tickeyApp')
	.controller('MatchPlayerCtrl', function($scope, angularFire, $routeParams, $location) {
		$scope.waitingRoom = [];
		var waitingRoomRef = new Firebase("http://sophia-ttt.firebaseio.com/waitingroom/" + $routeParams.id);
		$scope.promise = angularFire(waitingRoomRef, $scope, "waitingRoom", []);

		
		$scope.promise.then(function() {
			if ($scope.waitingRoom.xJoined == true) {
				$scope.joinWaitingRoom();
				}
			else {
				$scope.createWaitingRoom();
				}
			});


		$scope.createWaitingRoom = function() {
			$scope.waitingRoom = {xJoined: true, gameBoardNumber: generateGameBoardNumber()}
			$scope.noticeMessage = "You are x, waiting for opponent.";

			waitingRoomRef.on('child_removed', function(snapshot) {
				//TODO should double check if I am paired
				$location.path('multiplayer/' + $scope.waitingRoom.gameBoardNumber + '/x')
			});
		}

		$scope.joinWaitingRoom = function() {
			var gameBoardNumber = $scope.waitingRoom.gameBoardNumber;
			console.log("before waiting room");
			$scope.waitingRoom = {};
			console.log("after waiting room");
			$location.path('multiplayer/' + gameBoardNumber + '/o');
		}

		function generateGameBoardNumber() {
			return Math.floor(Math.random() * 16777215).toString(16);
		}

	});