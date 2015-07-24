/*global Phaser */
'use strict';

/**
 * @ngdoc directive
 * @name lightApp.directive:dnrGame
 * @description
 * # dnrGame
 */
angular.module('lightApp')
.directive('dnrGame', function() {

  function compile(tElement) {


    function create() {

      game.stage.backgroundColor = '#fff';

      player = game.add.sprite(Math.floor(Math.random() * (game.width-60)) + 60  , game.height/2, createBlock(32,'black'));
      player.anchor.setTo(0.5, 0.5);

      //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function

      upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    }

    function update() {
      if (upKey.isDown) { player.y--; }
      else if (downKey.isDown) { player.y++; }
      if (leftKey.isDown) { player.x--; }
      else if (rightKey.isDown) { player.x++; }
    }
    
    /*jshint validthis:true */
    var game = new Phaser.Game(tElement[0].offsetWidth, 300, Phaser.CANVAS, 'game-canvas', {create: create, update: update});

    var player;
    var upKey;
    var downKey;
    var leftKey;
    var rightKey;
    var textureRegistry = {};

    function createBlock(size, color) {
      var name = size + '_' + color;
      if(textureRegistry[name]) {
        return textureRegistry[name];
      }
      
      var bmd = game.add.bitmapData(size, size);
      bmd.ctx.fillStyle = color;
      bmd.ctx.fillRect(0,0, size, size);
      textureRegistry[name] = bmd;
      return bmd;
    }
  }

  return {
    restrict: 'A',
    compile: compile,
    template: '<div id="game-canvas"></div>'
  };

});