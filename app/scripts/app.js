angular.module('LocalStorageModule').value('prefix', 'tickeyDB');
angular.module('tickeyApp', ['LocalStorageModule', 'firebase'])
    .config(function($routeProvider){
      $routeProvider
        // "http://localhost:9000/#/gameboard/abcde1234/x"
        .when('/gameboard', {
          templateUrl:'views/gameboard.html',
          controller: 'GameBoardCtrl'
        })
        .when('/howto', {
          templateUrl: 'views/howto.html',
          controller: 'HowToCtrl'
        })
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/matchplayer', {
          templateUrl: 'views/matchplayer.html',
          controller: 'MatchPlayerCtrl'
        })
        .when('/multiplayer/:id/:symbol', {
          templateUrl: 'views/multiplayer.html',
          controller: 'MultiplayerCtrl'
        })
        .otherwise({
          redirectTo: '/'
        })
    });