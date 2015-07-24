'use strict';

/**
 * @ngdoc function
 * @name lightApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the lightApp
 */
angular.module('lightApp')
  .controller('UserCtrl', function ($scope, $resource, $stateParams, BuddyService, MessageService) {

    $scope.MessageService = MessageService;
    var routes = {
      users: $resource('/api/users/single/:id', {id: '@id'}),
      addFriend: $resource('/api/users/addFriend'),
    };

    $scope.userId = $stateParams.id;

    routes.users.get({id: $scope.userId}, function(data) {
      $scope.user = data;
    });

    $scope.addFriend = function () {
      BuddyService.addBuddy({id: $scope.userId, name: $scope.user.name});
    };

    $scope.isBuddy = function(id){
      return BuddyService.isBuddy(id);
    };
  });