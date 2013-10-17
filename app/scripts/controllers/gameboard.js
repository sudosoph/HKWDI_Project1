'use strict';

angular.module('tickeyApp')
  .controller('GameBoardCtrl', function ($scope, $rootScope, $timeout, $routeParams, localStorageService, angularFire) {
    $scope.gameBoardId = $routeParams.id;
    $scope.mySymbol = $routeParams.mySymbol;    
    
    $scope.gameBoard = [];
    var gameBoardRef = new Firebase("https://sophia-ttt.firebaseio.com/room/" + $routeParams.id);
    $scope.promise = angularFire(gameBoardRef, $scope, "gameBoard");

    var ref = new Firebase('https://sophia-ttt.firebaseio.com');
    var p = angularFire(ref, $scope, "leaderData"); //binds leaderData to ref Firebase

    // $scope.leaderData = {leaderBoard: 
    //   {
    //     SeededData: 0
    //   }
    // };

    $scope.promise.then (function () {
      if ($scope.gameBoard.length == 0 && $routeParams.mySymbol == 'x') {
        console.log("I am First Move: Symbol: " + $routeParams.mySymbol);
        $scope.makeMyMove();
      } else {
        console.log("I am Second Move: Symbol: " + $routeParams.mySymbol);
        $scope.waitForOpponentToMove();
      }
    });
    
    $scope.waitForOpponentToMove = function() {
      gameBoardRef.once('child_added', function(snapshot) {
        // gameBoardRef.off('child_added');
        
        if ($scope.isLosing()) {
          // print losing
          // redirect to match player if play again
        } else if ($scope.isDraw()) {
          // print draw
          // redirect to match player if play again
        } else {
          $scope.makeMyMove();
        }
      });
    };
    
    $scope.getName = function () {
      $scope.userName = prompt("Enter your name");
      // console.log($scope.userName);
    }

    $scope.addWinToLeaderboard = function() {
      if ($scope.userName) {
        if ($scope.leaderData.leaderBoard.hasOwnProperty($scope.userName)) {
          $scope.leaderData.leaderBoard[$scope.userName]++;
        }
        else {
          $scope.leaderData.leaderBoard[$scope.userName] = 1;
        }
      }

    }

  	$rootScope.hideGameBoard = true;
  	$rootScope.hideHowTo = false;
  	$rootScope.hideHome = false;
    $rootScope.gameEnded = false;

    $scope.cells = ["","","","","","","","",""];
  	$scope.name = "Gameboard";
    
    $scope.addWin = localStorageService.get("addWin");
    if ($scope.addWin == undefined) {
    $scope.addWin = 0;
    
    }

  	$scope.currentSymbol = "x";

  	$scope.isDiagonalSameSymbols = function(currentPlayer) {
   $scope.firstDiagonalCheck = ($scope.cells[0] == currentPlayer &&
    $scope.cells[4] == currentPlayer &&
    $scope.cells[8] == currentPlayer);
   console.log("checks first diagonal")
  	$scope.secondDiagonalCheck = ($scope.cells[2] == currentPlayer &&
    $scope.cells[4] == currentPlayer &&
    $scope.cells[6] == currentPlayer);
    console.log("checks second diagonal")
  	return $scope.firstDiagonalCheck || $scope.secondDiagonalCheck;
}

  $scope.notOccupied = function(location) {
	  $scope.result = ($scope.cells[location - 1] == "");
	  return $scope.result;
	}

	$scope.makeNextMove = function(location, symbol) {
    $scope.cells[location - 1] = symbol;
	  // document.getElementById(location).classList.add(symbol); 
   //  document.getElementById(location).innerHTML = symbol;    
    
	}

	$scope.isWinning = function(currentPlayer) {
    // check first row horizontal winning condition
    // isSameSymbolsIn(1, 2, 3, currentPlayer);
    // check vertical
    for (var i=0; i <= 9; i+=3) {
      console.log("check horizontal");
      if ($scope.isSameSymbolsIn($scope.cells[i], $scope.cells[i + 1], $scope.cells[i + 2], currentPlayer)) {
        return true;
      }
    }

    // check horizontal
    for (var i=0; i <= 3; i++) {
      console.log("check vertical");
      if ($scope.isSameSymbolsIn($scope.cells[i], $scope.cells[i + 3], $scope.cells[i + 6], currentPlayer)) {
        return true;
      }
    }

    // check diagonal
    return $scope.isDiagonalSameSymbols(currentPlayer);


  }

	$scope.isSameSymbolsIn = function(first_cell_content, second_cell_content, third_cell_content, currentPlayer) {
	  $scope.first_comparison = first_cell_content == currentPlayer;
	  $scope.second_comparison = second_cell_content == currentPlayer;
	  $scope.third_comparison = third_cell_content == currentPlayer;   

	  $scope.result = $scope.first_comparison && $scope.second_comparison && $scope.third_comparison;

    console.log($scope.first_comparison);
    console.log($scope.second_comparison);
    console.log($scope.third_comparison);


	  return $scope.result;
}

	$scope.swapSymbol = function() {
  		if ($scope.currentSymbol == "x") {
  			$scope.currentSymbol = "o";
  		}
  		else {
  			$scope.currentSymbol = "x";
  		}
  	}

  $scope.addScore = function() {
    $scope.addWin = parseInt($scope.addWin) + 1;
    localStorageService.add("addWin", $scope.addWin);
  }

  	$scope.handleClick = function(location) {
		  if ($scope.notOccupied(location)) {
		    $scope.makeNextMove(location, $scope.currentSymbol);
          }
		    if ($scope.isWinning($scope.currentSymbol)) {
          alert($scope.currentSymbol + " wins!");
            $scope.addScore();
            $rootScope.gameEnded = true;
		    } else {
          $scope.swapSymbol();
          console.log("swaps player");
		      setTimeout(function(){
            $scope.$apply(function () {
  		        $scope.selectRandomSquare($scope.currentSymbol);
              console.log("Selects random sq");
              $scope.isLosing();
              $scope.swapSymbol();
              console.log("second swap");
              console.log($scope.cells);
            });
		      },1000);
	 	    }
	  } 

$scope.isLosing = function() {
  if ($scope.isWinning($scope.currentSymbol)) {
          alert($scope.currentSymbol + " wins!");
            $scope.addScore();
            $rootScope.gameEnded = true;
          }
        }

$scope.clearBoard = function() {
    for (var i=0; i<=9; i++) {
    $scope.cells[i] = "";
    console.log("clearBoard executed");

  }
}

$scope.restartGame = function() {
  console.log("restartGame");
  console.log("clearBoard called");
  $scope.clearBoard();
  $scope.currentSymbol = "x";
  $rootScope.gameEnded = false;
}

// Lab 2
$scope.selectRandomSquare = function(currentPlayer) {
    // generate a random number
    // test if the location is occupied
    // if it is occupied, generate again
    $scope.randomnumber;
    do {
      $scope.randomnumber = (Math.floor(Math.random()*9)+1);
    } while (!$scope.notOccupied($scope.randomnumber));    

      $scope.makeNextMove($scope.randomnumber, currentPlayer);
  }

//TIMER APP
    $scope.minutes = "00";
    $scope.seconds = "00";
    $scope.currentNumberOfSeconds = 0;
    $scope.intervalCallback;

    $scope.increment = function() {
      $scope.currentNumberOfSeconds++;

      $scope.minutes = $scope.formatZeroPadding(Math.floor($scope.currentNumberOfSeconds / 60));
      $scope.seconds = $scope.formatZeroPadding($scope.currentNumberOfSeconds % 60);

      $scope.intervalCallback = $timeout($scope.increment, 1000);
    }

    $scope.startTimer = function() {
      $scope.intervalCallback = $timeout($scope.increment, 1000);
    }

    $scope.stopTimer = function() {
      $timeout.cancel($scope.intervalCallback);
    }

    $scope.resetTimer = function() {
      $scope.minutes = "00";
      $scope.seconds = "00";
    }

    $scope.formatZeroPadding = function(integer) {
      if (integer < 10) {
        return "0" + integer;
      } else {
        return integer;
      }
    }
});