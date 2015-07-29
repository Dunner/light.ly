'use strict';

/**
 * @ngdoc directive
 * @name lightApp.directive:dnrQuadProgress
 * @description
 * # dnrQuadProgress
 */
angular.module('lightApp')
.directive('dnrQuadProgress', function($timeout) {

  function link(scope, element) {
    scope.test = undefined;
    element.test = undefined;
    scope.percent = 100;

    var top = angular.element(element.children(0)[0]),
        right = angular.element(element.children(0)[1]),
        bottom = angular.element(element.children(0)[2]),
        left = angular.element(element.children(0)[3]);

    top.percent = 'width';
    right.percent = 'height';
    bottom.percent = 'width';
    left.percent = 'height';

    function setPercent(percent) {
      if (percent > 0) {
        setSpecific(top, percent * 4);
      } 
      if (percent > 25) {
        setSpecific(right, (percent - 25) * 4);
      } 
      if (percent > 50) {
        setSpecific(bottom, (percent - 50) * 4);
      } 
      if (percent > 75) {
        setSpecific(left, (percent - 75) * 4);
      }
    }
    function setSpecific(which, percent) {
      which.css(which.percent, percent + '%');
    }
    function clear(){
      setSpecific(top, 0);
      setSpecific(right, 0);
      setSpecific(bottom, 0);
      setSpecific(left, 0);
    }
    scope.$watch('percent', function() {
      element.removeClass('ng-hide');
      element.addClass('ng-show');
      $timeout(function() {
        setPercent(scope.percent);
      },1000);
      $timeout(function() {
        clear();
        element.removeClass('ng-show');
        element.addClass('ng-hide');
      },2500);
    });

  }

  return {
    restrict: 'A',
    link: link,
    template: 
      '<div class="bar"></div>'+
      '<div class="bar"></div>'+
      '<div class="bar"></div>'+
      '<div class="bar"></div>'
  };

});