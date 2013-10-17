'use strict';

angular.module('tickeyApp')
  .controller('HowToCtrl', function ($scope, $rootScope, localStorageService) {

  	$rootScope.hideHowTo = true;
  	$rootScope.hideGameBoard = false;
  	$rootScope.hideHome = false;

  	$scope.name = "How To";

  });