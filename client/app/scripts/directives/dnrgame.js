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

    var player,
        sail,
        objRudder,
        objTrueWind,
        objApparentWind,
        upKey,
        downKey,
        leftKey,
        rightKey,
        sailangle,
        rudderangle = 0,
        truewind = {
          angle: 90,
          velocity: 8
        },
        filter;

    var textureRegistry = {};

    function preload() {
      game.load.crossOrigin = 'anonymous';
      //game.load.image('background','images/waterSeamlessLoop.gif');
      game.load.shader('bacteria', 'assets/shaders/bacteria.frag');
    }

    function create() {
      
      game.add.tileSprite(0, 0, 20000, 20000, 'background');
      game.world.setBounds(0, 0, 20000, 20000);

      createShader();

      player = game.add.sprite(10000, 10000, createBlock(80, 30,'white'));

      
      sail = game.add.sprite(10000, 10000, createBlock(40, 2,'black'));
      objRudder = game.add.sprite(10000, 10000, createBlock(20, 3,'brown'));
      objTrueWind = game.add.sprite(10000, 10000, createBlock(50, 10,'blue'));
      objApparentWind = game.add.sprite(10000, 10000, createBlock(40, 2,'red'));
      
      player.anchor.setTo(0.5, 0.5);
      player.fullangle = 0;
      player.speed = 0;
      sail.anchor.setTo(0.5, 0.5);
      objRudder.anchor.setTo(1, 0.5);
      objTrueWind.anchor.setTo(-3, 0.5);
      objApparentWind.anchor.setTo(0.5, 0.5);

      
      
      upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      game.camera.follow(player);
      

      
    }

    function update() {



      var boatwindangle = 0;
      sail.x = player.x;
      sail.y = player.y;
      objTrueWind.x = player.x;
      objTrueWind.y = player.y;
      objApparentWind.x = player.x;
      objApparentWind.y = player.y;
      objRudder.x = player.x-(40 * Math.cos(player.angle * Math.PI / 180));
      objRudder.y = player.y-(40 * Math.sin(player.angle * Math.PI / 180));
      player.fullangle = player.angle;
      
      //180 - Math.abs(Math.abs(player.angle - truewind.angle) - 180);
      if(player.angle < 0) {
        player.fullangle = Math.abs(player.angle + 360);
      }
      boatwindangle = player.fullangle - truewind.angle;
      boatwindangle = (boatwindangle + 180) % 360 - 180;
      if(boatwindangle > 0) {
        boatwindangle = boatwindangle * -1;
      } else {
        boatwindangle = Math.abs(boatwindangle);
      }

      

      function rad(x){
        x = ((x*Math.PI)/180);
        return x;
      }
      function deg(x){
        x = ((x/Math.PI)*180);
        return x;
      }
      function beta (wta, wts, bs) {
        var angle;
        var sign = 1; // -1 for port, +1 for starboard
        if (wta < 0) {
          sign = -1;
          wta *= -1;
        }
        angle = deg(Math.atan(wts*Math.sin(rad(wta))/(bs + wts*Math.cos(rad(wta)))));

        if (angle < 0){
          angle = angle + 180;
        }
        return angle*sign;
      }
      function speed (wta, wts, bs) {
        var angle = beta(wta, wts, bs);
        var as = wts * Math.sin(rad(wta))/Math.sin(rad(angle));
        return as;
      }
      var as = speed(boatwindangle, truewind.velocity, player.speed);
      
      sail.angle = player.angle + sailangle;
      objRudder.angle = player.angle + rudderangle;
      objTrueWind.angle = truewind.angle;
      objApparentWind.angle = beta(boatwindangle, truewind.velocity, player.speed);
      objApparentWind.scale.setTo(as-truewind.velocity+0.5, 1);

      //Sail controls
      if (leftKey.isDown) {
        //if(sailangle > -65) sailangle-=3;
        sailangle-=1.5;
      }
      else if (rightKey.isDown) {
        //if(sailangle < 65 ) sailangle+=3; 
        sailangle+=1.5; 
      }
      
      //Rudder controls
      if (upKey.isDown) {
        rudderangle--;
      } else if (downKey.isDown) {
        if(rudderangle < 70) {rudderangle++;} 
      }
      //Apply directional change
      if(rudderangle > 0 && player.speed > 0) {
        player.angle -= Math.abs(rudderangle/200);
        rudderangle -= Math.abs(rudderangle/200);
      }
      if(rudderangle < 0 && player.speed > 0) {
        player.angle += Math.abs(rudderangle/200);
        rudderangle += Math.abs(rudderangle/200);
      }
      sailangle = objApparentWind.angle+1;
      sail.angle = objApparentWind.angle+1;
      //Apply speed
      var sailappdiff = 90 - Math.abs(Math.abs(sail.angle - objApparentWind.angle) - 90);
      if (player.speed < 2) {
        if (Math.abs(boatwindangle) > 35) {
          if ( sailappdiff < 35) {
              
             player.speed += Math.abs(0.001);
          }
        } else {
          //sailing into deadzone
          if (player.speed > 0) {
            player.speed -= Math.abs(0.001);
          }
        }

      }
      if (player.speed > 0 && sailappdiff > 35) {
        player.speed -= Math.abs(0.001);
      }
      if (player.speed > 2 ) {
        player.speed -= Math.abs(0.001);
      }
      
      //Lololo, wattodo
      if (player.speed > 0) {
        //filter.uniforms.mouse.value.x = filter.uniforms.mouse.value.x+(0.001 * Math.cos(player.angle * Math.PI / 180));
        //filter.uniforms.mouse.value.y = filter.uniforms.mouse.value.y-(0.001 * Math.sin(player.angle * Math.PI / 180));
      }

      
      player.x += player.speed * Math.cos(player.angle * Math.PI / 180);
      player.y += player.speed * Math.sin(player.angle * Math.PI / 180);



      filter.update();
      

      
      game.debug.text('Boat angle :' + player.angle.toFixed(0), 32, 32);
      game.debug.text('BoatWind angle :' + boatwindangle.toFixed(0), 32, 50);
      game.debug.text('Truewind angle :' + truewind.angle.toFixed(0), 32, 75);
      game.debug.text('Truewind velocity :' + truewind.velocity.toFixed(0), 32, 90);
      
      game.debug.text('Apparent angle :' + objApparentWind.angle.toFixed(0), 32, 120);
      game.debug.text('Apparent velocity :' + as.toFixed(0), 32, 135);
      
      game.debug.text('playerfullangle :' + player.fullangle.toFixed(0), 32, 165);
      
      game.debug.text('diff :' + Math.abs(boatwindangle), 32, 240);


    }


    function createBlock(x,y, color) {
      var name = x + '_' + color;
      if(textureRegistry[name]) {
        return textureRegistry[name];
      }

      var bmd = game.add.bitmapData(x, y);
      bmd.ctx.fillStyle = color;
      bmd.ctx.fillRect(0,0, x, y);
      textureRegistry[name] = bmd;
      return bmd;
    }



    function createShader() {

        var fragmentSrc = [
            'precision mediump float;',

            'uniform float time;',
            'uniform vec2 mouse;',
            'uniform vec2 resolution;',

            'float length2(vec2 p) { return dot(p, p); }',

            'float noise(vec2 p){',
              'return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 31.0011);',
            '}',

            'float worley(vec2 p) {',
              'float d = 1e30;',
              'for (int xo = -1; xo <= 1; ++xo) {',
                'for (int yo = -1; yo <= 1; ++yo) {',
                  'vec2 tp = floor(p) + vec2(xo, yo);',
                  'd = min(d, length2(p - tp - vec2(noise(tp))));',
                '}',
              '}',
              'return 3.0*exp(-4.0*abs(2.0*d - 1.0));',
            '}',

            'float fworley(vec2 p) {',
              'return sqrt(sqrt(sqrt(',
                '2.1 * // light',
                'worley(p*5. + .3 + time*.0525) *',
                'sqrt(worley(p * 50. + 0.9 + time * -0.15)) *',
                'sqrt(sqrt(worley(p * -10. + 9.3))))));',
            '}',

            'void main() {',
              'vec2 uv = gl_FragCoord.xy / resolution.xy + mouse;',
              'float t = fworley(uv * resolution.xy / 1500.0);',
              't *= exp(-length2(abs(0.7*uv - 1.0)));',
              'gl_FragColor = vec4(t * vec3(0.1, 1.5*t, 1.2*t + pow(t, 0.5-t)), 0.9);',
            '}'
        ];

        filter = new Phaser.Filter(game, null, fragmentSrc);
        filter.setResolution(tElement[0].offsetWidth, tElement[0].offsetHeight);

        var sprite = game.add.sprite();
        sprite.width = tElement[0].offsetWidth;
        sprite.height = tElement[0].offsetHeight;
        sprite.x = game.camera.x;
        sprite.y = game.camera.y;
        

        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        sprite.filters = [ filter ];

    }




    /*jshint validthis:true */
    var game = new Phaser.Game(tElement[0].offsetWidth, tElement[0].offsetHeight, Phaser.AUTO, 'game-canvas', {preload: preload, create: create, update: update});





  }

  return {
    restrict: 'A',
    compile: compile,
    template: '<div id="game-canvas"></div>'
  };

});