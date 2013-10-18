'use strict';

angular.module('tickeyApp')
    .controller('MultiplayerCtrl', function ($scope, $rootScope, $timeout, $routeParams, angularFire) {
            $scope.gameBoardId = $routeParams.id;
            $scope.mySymbol = $routeParams.symbol;
            $scope.myTurn = false;
            $scope.turnNum = 0;
            $rootScope.gameEnded = false;

            $scope.cells = ["", "", "", "", "", "", "", "", ""];
            var gameBoardRef = new Firebase("https://sophia-ttt.firebaseio.com/room/" + $routeParams.id);
            $scope.promise = angularFire(gameBoardRef, $scope, "cells", []);

            $scope.promise.then(function() {
                console.log("In Game Board");
                console.log($scope.gameBoardId);
                console.log($scope.mySymbol);

                $scope.cells = ["", "", "", "", "", "", "", "", ""];

                if ($scope.cells.length == 0 && $routeParams.symbol == 'x') {
                    console.log("I am First Move: Symbol: " + $routeParams.symbol);
                    $scope.myTurn = true;
                } else {
                    console.log("I am Second Move: Symbol: " + $routeParams.symbol);
                    $scope.myTurn = false;
                }
            });

            gameBoardRef.on('value', function(snapshot) {
                console.log("snapshot received");
                if (!$scope.gameEnded && !$scope.myTurn) {
                    if (snapshot.val() != null) {
                        if (!arrays_equal(snapshot.val(), $scope.cells)) {
                            console.log("different gameboard- data from remote");
                            if ($scope.isLosing($scope.mySymbol, snapshot.val())) {
                                console.log("opponent won. you lost.");
                                $timeout(function() {
                                    window.alert("You lost!");
                                }, 50);
                                $scope.gameEnded = true;
                            } else if ($scope.isDraw()) {
                                console.log("It's a tie!");
                                $scope.mySymbol = "";
                                $scope.gameEnded = true;
                            } else {
                                console.log("My turn");
                                $scope.myTurn = true;
                                $scope.turnNum++;
                            }
                            console.log("After opponent clicked: turn # " + $scope.turnNum + "$scope.cells: " + snapshot.val().join(""));
                        } else {
                            console.log("same gameboard");
                        }
                    } else {
                        console.log("Snapshot empty");
                    }
                } else {
                    console.log("My turn but receiving");
                }
            }

        $scope.handleClick = function(location) {
        if (!$scope.gameEnded) {
            if ($scope.myTurn && $scope.notOccupied(location)) {
            console.log("I clicked on index: " + location);

            $scope.gameBoard[location] = $scope.mySymbol;

            if ($scope.isWinning($scope.mySymbol, $scope.gameBoard)) {
                $timeout(function() {window.alert('You won!');}, 50);
                $scope.gameEnded = true;
            } else if ($scope.isDraw()) {
                $scope.mySymbol = '';
                $scope.gameEnded = true;
            } else {
                $scope.myTurn = false;
                $scope.turnNum++;
            }
              console.log("After my click: turn # " + $scope.turnNum + "$scope.gameBoard: " + $scope.gameBoard.join(""));
            } 
          }
        }

        var xPatterns = [
            'xxx......',
            '...xxx...',
            '......xxx',
            'x..x..x..',
            '.x..x..x.',
            '..x..x..x',
            'x...x...x',
            '..x.x.x.x..'
        ];

        var oPatterns = xPatterns.map(function(str) {
            return str.replace(/x/g, 'o');
        });

        function arrays_equal(a, b) {
            return !(a < b || b < a);
        }

        $scope.isWinning = function(currentPlayer, gameBoardData) {
            console.log("isWinning");
            $scope.gameBoardStr = gameBoardData.join("");
            var spacePattern = /\s/g;
            var patternString = $scope.gameBoardStr.replace(spacePattern, '.');
            console.log("Gameboard String: " + patternString)
            if (playerSymbol == 'x') {
                var pattern = xPatterns;
            } else {
                var pattern = oPatterns;
            };

            for (var i = 0; i < pattern.length; i++) {
                var re = new RegExp(patterns[i], "i");
                if (patternString.match(re)) {
                    console.log("Pattern Matching success. We won");
                    return true;
                };
            };
            return false;
        }

        $scope.isLosing = function(mySymbol, gameBoardData) {
            var opponentSymbol = mySymbol == "x" ? "o" : "x";
            return $scope.testForWin(opponentSymbol, gameBoardData);
        }

        $scope.isDraw = function() {
            return ($scope.turnNum === 9);
        }

        $rootScope.hideGameBoard = true; $rootScope.hideHowTo = false; $rootScope.hideHome = false;

        $scope.currentSymbol = "x";

        $scope.notOccupied = function(location) {
            $scope.result = ($scope.cells[location - 1] == "");
            return $scope.result;
        }

        $scope.clearBoard = function() {
            for (var i = 0; i <= 9; i++) {
                $scope.cells[i] = "";
            }
        }

        $scope.restartGame = function() {
            $scope.clearBoard();
            $scope.currentSymbol = "x";
            $rootScope.gameEnded = false;
        }
});