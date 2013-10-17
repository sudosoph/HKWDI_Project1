'use strict';

angular.module('tickeyApp')
  .controller('MainCtrl', function ($scope, $rootScope) {

  	$rootScope.hideHome = true;
  	$rootScope.hideGameBoard = false;
  	$rootScope.hideHowTo = false;

  	$scope.name = "Main";
  	
  });
