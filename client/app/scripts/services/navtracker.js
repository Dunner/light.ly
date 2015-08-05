'use strict';

/**
 * @ngdoc service
 * @name lightApp.navtracker
 * @description
 * # navtracker
 * Factory in the lightApp.
 */
angular.module('lightApp')
  .factory('navtracker', function () {

  	var factory = [];
    var navInfo = {
      title:'',
      group:''
    };
    var display = true;

    factory.getLocation = function() {
      return navInfo;
    };

    factory.show = function() {
			display = true;
    };

    factory.hide = function() {
      display = false;
    };

    factory.visible = function(){
    	return display;
    };

    factory.toggle = function() {
      display = !display;
    };

    factory.setLocation = function(title, group) {
      navInfo.title = title;
      navInfo.group = group;
    };

    return factory;

  });
