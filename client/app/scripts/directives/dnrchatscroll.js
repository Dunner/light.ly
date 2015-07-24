'use strict';

/**
 * @ngdoc directive
 * @name lightApp.directive:dnrChatscroll
 * @description
 * # dnrChatscroll
 */
angular.module('lightApp')
  .directive('dnrChatscroll', function ($window, scroll) {
    return {
      restrict: 'EA',
      scope: true,
      link: function (scope, element) {

        var Vlelems, last,
          notches = 0,
          scrollDiv = element[0].children[1],
          scrollBar = element[0].children[0],
          win = angular.element($window),
          winHeight = $window.innerHeight,
          winWidth = $window.innerWidth;
        scope.currentIdY = 0;

        function init() {
          Vlelems = scrollDiv.children;
          notches = 100 / Vlelems.length;
          updateScroll();
        }

        function reScale() {
          winHeight = $window.innerHeight;
          winWidth = $window.innerWidth;
          init();
        }

        scope.$watch(
          function () { return scrollDiv.children.length; },
          function (newValue, oldValue) {
            if (newValue !== oldValue) {
              //new item
              Vlelems = scrollDiv.children;
              last = angular.element(Vlelems[Vlelems.length - 1]);
              scroll.scrollToY(scrollDiv, last[0], 0, 200);
              scope.currentIdY = Vlelems.length - 1;
              init();
            }
          }
        );

        win.bind('resize', function () {reScale();});

        function updateScroll() {
          angular.element(scrollBar).css({
            'top': scope.currentIdY * notches + '%',
            'height': notches + '%'
          });
          for (var i = Vlelems.length - 1; i >= 0; i--) {
            angular.element(Vlelems[i]).css({
              'border-left-width': '0px'
            });
          }
          angular.element(Vlelems[scope.currentIdY]).css({
            'border-left-width': '10px'
          });
        }

        setTimeout(function(){init();},300);
      }
    };
  });

