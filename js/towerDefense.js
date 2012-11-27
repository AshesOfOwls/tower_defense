// --------------------------------------------------------------------- //
// --------------------------------------------------------------------- //
// ---------------------- Random Tower Defense ------------------------- //
// --------------------------------------------------------------------- //
// --------------------------------------------------------------------- //

// !! --------- Create some variables for the initial setup --------- !! //

// - Setup the number of zones, and the number of rows. NEVER CHANGE
	var zonesNum = 160;
	var rows = 16;

// - Basic information pertaining to the game mechanics
	var lives = 20;
	var level = 1;
	var spawnPoint = 77;
	var money = 550;
	var zIndexCount = 9999;

// - Display the starting information
	$(function() { 
		$('#lives').text(lives);
		$('#level').text(level);
		$('#money').text('$'+money);
	});
	
// !! ----------------------- Make the zones ----------------------- !! //

// - Create the zone object to be replicated
	var zone = function(id,left,top) {
		// Add the zone to the map
		$('#map').prepend('<div id="zone'+id+'" class="zone"></div>');
		
		// Set the zone offset
		zoneObject = $('#zone'+id);
		zoneObject.css('left',left);
		zoneObject.css('top',top);
		
		// Set the hover for the zone
		zoneObject.hover(function() {
			if($(this).hasClass('road')) {
				// If it is in the road you cannot build there
				$(this).css('background-image','url("img/hover_red.png")');
			} else {
				// A-OK to build here!
				$(this).css('background-image','url("img/hover.png")');
			}},function() {
				$(this).css('background-image','')
			});
		
		zoneObject.click(function() {
			if(!$(this).hasClass('road')) {
				var selection = document.body.style.cursor.split('_')[0].split('/')[2];
				
				if(selection != undefined) {
					if(selection == "tower1" && money >= 200) {
						new Tower1($('#zone'+id));
						money -= 200;
					} else if(selection == "tower2" && money >= 200) {
						new Tower2($('#zone'+id));
						money -= 200;
					} else if(selection == "tower3" && money >= 200) {
						new Tower3($('#zone'+id));
						money -= 200;
					} else if(selection == "tower4" && money >= 200) {
						new Tower4($('#zone'+id));
						money -= 200;
					}
					
					$('#money').text('$'+money);
					$('body').css('cursor','default');
					
				}
			} else {
			
			}
		});
	}
	
// - Now populate the map with the zones
	$(function() {
		for(i=1;i<=zonesNum;i++) {
			// Calculate the zone offset
			var left = ((i-1)%rows) * 60;
			var top = (Math.floor((i-1)/rows) * 60)+100;
			var zones = new zone(i,left,top);
				
			// !! -- Set the road zones -- !! //
			if(i==2||i==18||i==34||i==35||i==36||i==52||i==68||i==84||i==83||i==82||i==98||i==114||i==130||i==131||i==132||i==133||i==134||i==135||i==136||i==137||i==138||i==139||i==140||i==141||i==142||i==143||i==127||i==111||i==95||i==79||i==78||i==77||i==76||i==92||i==108||i==107||i==106||i==90||i==74||i==73||i==72||i==88||i==104||i==103||i==102||i==142||i==70||i==54||i==38||i==22||i==23||i==24||i==25||i==41||i==42||i==43||i==44||i==45||i==29||i==30||i==31||i==32||i==86) {
				$('#zone'+i).addClass('road');
			}
		}
	});
	
// !! ----- Set up the waypoints. These change per map and are ----- !! //
// !! --- designed to give the pathfinding to the NPC characters --- !! //

// - First off, create an array to hold the data for each waypoint
	var totalWaypoints = 21;
	var waypoints = new Array(totalWaypoints);
	for(j=0;j<totalWaypoints;j++) {
		waypoints[j] = new Array(2);
	}
	
// - Now set the data for the waypoints. Minified.
	waypoints[0][0] = 'top';waypoints[0][1] = 210;waypoints[1][0] = 'left';waypoints[1][1] = 120;waypoints[2][0] = 'top';waypoints[2][1] = 180;waypoints[3][0] = 'left';waypoints[3][1] = -120;waypoints[4][0] = 'top';waypoints[4][1] = 180;waypoints[5][0] = 'left';waypoints[5][1] = 780;waypoints[6][0] = 'top';waypoints[6][1] = -240;waypoints[7][0] = 'left';waypoints[7][1] = -180;waypoints[8][0] = 'top';waypoints[8][1] = 120;waypoints[9][0] = 'left';waypoints[9][1] = -120;waypoints[10][0] = 'top';waypoints[10][1] = -120;waypoints[11][0] = 'left';waypoints[11][1] = -120;waypoints[12][0] = 'top';waypoints[12][1] = 120;waypoints[13][0] = 'left';waypoints[13][1] = -120;waypoints[14][0] = 'top';waypoints[14][1] = -300;waypoints[15][0] = 'left';waypoints[15][1] = 180;waypoints[16][0] = 'top';waypoints[16][1] = 60;waypoints[17][0] = 'left';waypoints[17][1] = 240;waypoints[18][0] = 'top';waypoints[18][1] = -60;waypoints[19][0] = 'left';waypoints[19][1] = 223;waypoints[20][0] = 'left';waypoints[20][1] = 1;
	
// !! ------------ Create Objects/Classes for the NPC's ------------ !! //

// - Create the overall NPC object/class
	function Npc(element) {
		// "self" is to be used to call the object from functions
		var self = this;
		
		// - Set up the container DIV for this character
		this.container = $('<div class="npc"></div>');
		this.container.appendTo(element);
		
		$(this.container).css('z-index',zIndexCount);
		zIndexCount -= 5;
		
		// - Set the offset of the character to the spawn point
		$(this.container).css('left',spawnPoint+'px');
		
		var healthBar = $('<div class="healthBar"></div>');
		this.container.append(healthBar);
		
		// The move function which gives the pathing for the character
		this.move = function(thisObject,speed,waypoint) {
		
			// - Interval to determine if the character has reached the waypoint, if it has,
			// - then the character has stopped animating and will move to the next point
			var npcWait = setInterval(function() {
				if(!thisObject.is(':animated')) {
					clearInterval(npcWait);
					
					// - Determine the speed of this character by taking the waypoint distance,
					// - divide by the tile height, and multiply by the speed factor, returning
					// - the animation time in milliseconds.
					var speedFactor = speed * (parseInt(waypoints[waypoint][1]) / 60);
					
					// - If the speed is below zero, convert to postive.
					if(speedFactor < 0) {
						speedFactor = speedFactor * -1;
					}
					
					// - If the next waypoint is vertical movement, do this, if it
					// - is horizontal movement, do that.
					if(waypoints[waypoint][0] == 'top') {
					
						// - Do the animation of the character
						thisObject.animate({'top': '+='+waypoints[waypoint][1]+'px'}, speedFactor,'linear');
						if(waypoints[waypoint][1] > 0) {
							// - If the movement is up, character faces yp.
							thisObject.spState(1);
						} else {
							// - If the movement is down, character faces down.
							thisObject.spState(2);
						}
					} else {
					
						// - Do the animation of the character
						thisObject.animate({'left': '+='+waypoints[waypoint][1]+'px'}, speedFactor,'linear');
						if(waypoints[waypoint][1] > 0) {
							// - If the movement is right, character faces right.
							thisObject.spState(4);
						} else {
							// - If the movement is left, character faces left.
							thisObject.spState(3);
						}
					}
					
					if(waypoint<(waypoints.length-1)) {
						// - If the end waypoint hasn't been reached, recall the
						// - function to move forward again.
						self.move(thisObject,speed,(waypoint+1));
					} else {
						// - If the end point is reached, DEATH TO ALL!
						if(thisObject.is(':visible')) {;
							death(thisObject);
						}
					}
				}
			},10);
		}
	}

// - NPC Prototypes
	function Skeleton(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		this.health = 100;
		
		thisObject.addClass('skeleton');
		thisObject.sprite({fps: 9, no_of_frames: 6});
		thisObject.spState(1);
		
		this.move($(this.container),this.speed,0);
	}
	Skeleton.prototype = new Npc;
	
	function Warrior(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','55px');
		thisObject.css('top','-5px');
		
		thisObject.addClass('player');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Warrior.prototype = new Npc;
	
	function Pidgeotto(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','48px');
		thisObject.css('top','-10px');
		
		thisObject.addClass('pidgeotto');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Pidgeotto.prototype = new Npc;
	
	function Behemoth(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','42px');
		thisObject.css('top','-25px');
		
		thisObject.addClass('behemoth');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Behemoth.prototype = new Npc;
	
	function Caterpillar(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','60px');
		thisObject.css('top','15px');
		
		thisObject.addClass('caterpillar');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Caterpillar.prototype = new Npc;
	
	function MagdaMonster(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','66px');
		thisObject.css('top','8px');
		
		thisObject.addClass('magdamonster');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	MagdaMonster.prototype = new Npc;
	
	function RedDragon(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','53px');
		thisObject.css('top','-18px');
		
		thisObject.addClass('reddragon');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	RedDragon.prototype = new Npc;
	
	
	function Gargoyle(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','52px');
		thisObject.css('top','-26px');
		
		thisObject.addClass('gargoyle');
		thisObject.sprite({fps: 7, no_of_frames: 4});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Gargoyle.prototype = new Npc;
	
	
	function Goblins(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','63px');
		thisObject.css('top','15px');
		
		thisObject.addClass('goblins');
		thisObject.sprite({fps: 7, no_of_frames: 9});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Goblins.prototype = new Npc;
	
	function Ogre(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','62px');
		thisObject.css('top','3px');
		
		thisObject.addClass('ogre');
		thisObject.sprite({fps: 7, no_of_frames: 5});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Ogre.prototype = new Npc;
	
	function Gyrocopter(element) {
		Npc.call(this, element);
		var thisObject = $(this.container);
		
		this.speed = 1000;
		
		// Set offset
		thisObject.css('left','55px');
		thisObject.css('top','-15px');
		
		thisObject.addClass('gyrocopter');
		thisObject.sprite({fps: 7, no_of_frames: 2});
		thisObject.spState(1);
		
		this.move(thisObject,this.speed,0);
	}
	Gyrocopter.prototype = new Npc;
	
// !! ------------------ Death function (MUAHAHA) ------------------ !! //

	function death(thisObject) {
		thisObject.remove();
		lives -= 1;
		$('#lives').text(lives);
	}
	
	
// !! -------------------- Tower Objects/Classes ------------------- !! //

// - Main tower object
	function Tower(element) {
		// - "self" is to be used to call the object from functions
		var self = this;
		
		// - The tower container
		this.container = $('<div id="tower"></div>');
		this.container.appendTo(element);
		
		this.build = function(thisObject) {
			var inter = 1;
			var buildInterval = setInterval(function() {
				if(inter < 6) {
					var backgroundPosition = parseInt(thisObject.css('background-position').split('px')[0])-parseInt(thisObject.css('width'));
					thisObject.css('background-position',backgroundPosition+'px');
					inter++;
				} else {
					clearInterval(buildInterval);
					self.attack();
				}
			}, 1000);
		}
		
		var thisObject = this.container;
		this.attack = function() {
			var shootingInterval = setInterval(function() {
				if(self.container.hasClass('tower1')) {
					new Arrow(self.container);
				} else if(self.container.hasClass('tower2')) {
					new Arrow2(self.container);
				} else if(self.container.hasClass('tower3')) {
					new Arrow3(self.container);
				} else {
					new Arrow4(self.container);
				}
				
			},2000);
		}
	}
	
// - First tower (Human warcraft)
	function Tower1(element) {
		Tower.call(this, element);
		var thisObject = $(this.container);
		
		thisObject.addClass('tower1');
		
		this.build(thisObject);
	}
	Tower1.prototype = new Tower;
	
// - Second tower (Ork warcraft)
	function Tower2(element) {
		Tower.call(this, element);
		var thisObject = $(this.container);
		
		thisObject.addClass('tower2');
		
		this.build(thisObject);
	}
	Tower2.prototype = new Tower;
	
function Tower3(element) {
		Tower.call(this, element);
		var thisObject = $(this.container);
		
		thisObject.addClass('tower3');
		
		this.build(thisObject);
	}
	Tower3.prototype = new Tower;
	
function Tower4(element) {
		Tower.call(this, element);
		var thisObject = $(this.container);
		
		thisObject.addClass('tower4');
		
		this.build(thisObject);
	}
	Tower4.prototype = new Tower;
	
// !! ------------------------- Projectile ------------------------- !! //
	function Projectile(element) {
		var self = this;
		
		this.element = element;
		this.container = $('<div></div>');
		
		this.move = function() {
			self.xCoor = parseInt(self.element.parent().css('left').split('px')[0])+28;
			self.yCoor = parseInt(self.element.parent().css('top').split('px')[0])+28;
			
			var shortestDistance = 9999;
			var distance = 9999;
			var thisX = 0;
			var thisY = 0;
			var adjacent = 0;
			var opposite = 0;
			var leftMove = 0;
			var topMove = 0;

			$('.npc').each(function() {
				thisX = parseInt($(this).css('left').split('px')[0]);
				thisY = parseInt($(this).css('top').split('px')[0]);
				
				adjacent = self.xCoor - thisX;
				opposite = self.yCoor - thisY;
				
				distance = Math.sqrt((adjacent * adjacent) + (opposite * opposite));
				
				if(distance < shortestDistance) {
					shortestDistance = distance;
					topMove = opposite;
					leftMove = adjacent;
				}
			});
			
			if(shortestDistance < this.radius && shortestDistance > (-1 * this.radius)) {
				self.container.appendTo(element);
				
				if(self.type == 'cata') {
					var thisObject = element;
					var inter = 1;
					$('body').append('<embed src="sound/cata.wav" autostart="true" hidden="true" loop="false">');
					thisObject.css('background-position','0px');
					var attackInterval = setInterval(function() {
						if(inter < 6) {
							var backgroundPosition = parseInt(thisObject.css('background-position').split('px')[0])-parseInt(thisObject.css('width'));
							thisObject.css('background-position',backgroundPosition+'px');
							inter++;
						} else {
							clearInterval(attackInterval);
							
						}
					}, 200);
				} else if(self.type == 'arrow') {
					$('body').append('<embed src="sound/arrow.wav" autostart="true" hidden="true" loop="false">');
				} else if(self.type == 'cannon') {
					$('body').append('<embed src="sound/cannon.wav" autostart="true" hidden="true" loop="false">');
				} else if(self.type == 'photon') {
					$('body').append('<embed src="sound/photon.wav" autostart="true" hidden="true" loop="false">');
				}
				
				topMove -= 60;
				leftMove -= 30;
				
				var ratio = topMove / leftMove;
				
				if(leftMove > 30) {
					leftMove += 30;
				} else if(leftMove < -30) {
					leftMove -= 30;
				}
				
				if(topMove > 30) {
					topMove += 30;
				} else if(topMove < -30) {
					topMove -= 30;
				}
				
				
				var angle = Math.atan2(topMove,leftMove);
				var rotation = (angle*180/Math.PI)+180;
				
				self.container.css('-moz-transform','rotate('+rotation+'deg)');
				
				if(shortestDistance < 100) {
					shortestDistance = 100;
				}
				
				self.container.animate({
					top: (topMove * -1) + 'px',
					left: (leftMove * -1) + 'px'
				}, {
					duration: 5 * shortestDistance,
					easing: 'linear',
					complete: function() {
						self.container.remove();
						clearInterval(hitTest);
					}
				});
				
				var hitTest = setInterval(function() {
					if(self.container._hittest($('.npc'))) {
						var thisObj = $(this);
						$('.npc').each(function() {
							if($(this)._hittest(self.container)) {
								var health = parseInt($(this).find('.healthBar').css('background-position').split('px')[0]);
								
								if(self.damage - ((level - 1) * 5) <= 0) {
									damage = 2;
								} else {
									damage = self.damage - ((level - 1) * 5);
								}
								health = health - damage;
								
								if(health <= -50) {
									new addCoin($(this));
									$(self.container).remove();
									$(this).remove();
									if(level != 1) {
										money += (7 * (level));
									} else {
										money += 10;
									}
									$('#money').text('$'+money);
								} else {
									$(this).find('.healthBar').css('background-position',health+'px');
								}
								
								return false;
							}
						});
						clearInterval(hitTest);
					}
				},1);
			} else {
				self.container.remove();
			}
		}
	}
	
	function addCoin(thisObject) {
		$('body').append('<embed src="sound/coin.wav" autostart="true" hidden="true" loop="false">');
		var interem = 1;
		var thisX = parseInt(thisObject.css('left').split('px')[0])+15;
		var thisY = parseInt(thisObject.css('top').split('px')[0])+30;
		var self = this;
		this.coin = $('<div class="coin"></div>');
		this.coin.prependTo($('#map'));
		this.coin.css('top',thisY+'px');
		this.coin.css('left',thisX+'px');
			var coinInterval = setInterval(function() {
				if(interem < 4) {
					var backgroundPosition = parseInt(self.coin.css('background-position').split('px')[0])-parseInt(self.coin.css('width'));
					self.coin.css('background-position',backgroundPosition+'px');
					interem++;
				} else {
					clearInterval(coinInterval);
					self.coin.remove();
				}
			}, 200);
	}
	
	function Arrow(element) {
		Projectile.call(this, element);
		var self = this;
		
		$(this.container).addClass('arrow');
		
		this.type = 'arrow';
		
		this.damage = 25;
		this.radius = 230;
		
		this.move();
	}
	Arrow.prototype = new Projectile;
	
	function Arrow2(element) {
		Projectile.call(this, element);
		var self = this;
		
		$(this.container).addClass('cannonBall');
		
		this.type = 'cannon';
		
		this.damage = 45;
		this.radius = 250;
		
		this.move();
	}
	Arrow2.prototype = new Projectile;
	
	function Arrow3(element) {
		Projectile.call(this, element);
		var self = this;
		
		$(this.container).addClass('photon');
		
		this.type = 'photon';
		
		this.damage = 70;
		this.radius = 230;
		
		this.move();
	}
	Arrow3.prototype = new Projectile;
	
	function Arrow4(element) {
		Projectile.call(this, element);
		var self = this;
		
		this.type = 'cata';
		
		$(this.container).addClass('fireball');
		
		this.damage = 95;
		this.radius = 230;
		
		this.move();
	}
	Arrow3.prototype = new Projectile;
	
	
$(function() {
	$('#buyTower1').click(function() {
		document.body.style.cursor="url('img/buybox/tower1_img.png'),help";
	});
	$('#buyTower2').click(function() {
		document.body.style.cursor="url('img/buybox/tower2_img.png'),help";
	});
	$('#buyTower3').click(function() {
		document.body.style.cursor="url('img/buybox/tower3_img.png'),help";
	});
	$('#buyTower4').click(function() {
		document.body.style.cursor="url('img/buybox/tower4_img.png'),help";
	});
});
	
	
$(function() { 
		$('body').append('<embed src="sound/menu.wav" autostart="true" hidden="true" loop="true">');
		var npcNum = 0;
		var countdown = 15;
		$('#countdown').text(countdown);
		var spawnCountdown = setInterval(function() {
			countdown -= 1;
			if(countdown == 0) {
				countdown = 60;
				if(npcNum < 20) {
					var npcWaiting = setInterval(function() {
						new Skeleton($('#map'));
						npcNum += 1;
						if(npcNum == 1) {
							$('body').append('<embed src="sound/skeleton.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 20) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 40) {
					var npcWaiting = setInterval(function() {
						new Warrior($('#map'));
						if(level == 1) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 21) {
							$('body').append('<embed src="sound/warriors.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 40) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 60) {
					var npcWaiting = setInterval(function() {
						new Pidgeotto($('#map'));
						if(level == 2) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 41) {
							$('body').append('<embed src="sound/pidgeotto.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 60) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 80) {
					var npcWaiting = setInterval(function() {
						new Behemoth($('#map'));
						if(level == 3) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 61) {
							$('body').append('<embed src="sound/behemoth.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 80) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 100) {
					var npcWaiting = setInterval(function() {
						new Caterpillar($('#map'));
						if(level == 4) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 81) {
							$('body').append('<embed src="sound/caterpillar.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 100) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 120) {
					var npcWaiting = setInterval(function() {
						new MagdaMonster($('#map'));
						if(level == 5) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 101) {
							$('body').append('<embed src="sound/magdamonster.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 120) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 140) {
					var npcWaiting = setInterval(function() {
						new RedDragon($('#map'));
						if(level == 6) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 121) {
							$('body').append('<embed src="sound/reddragon.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 140) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 160) {
					var npcWaiting = setInterval(function() {
						new Gargoyle($('#map'));
						if(level == 7) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 141) {
							$('body').append('<embed src="sound/gargoyle.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 160) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 180) {
					var npcWaiting = setInterval(function() {
						new Goblins($('#map'));
						if(level == 8) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 161) {
							$('body').append('<embed src="sound/goblins.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 180) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 200) {
					var npcWaiting = setInterval(function() {
						new Ogre($('#map'));
						if(level == 9) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 181) {
							$('body').append('<embed src="sound/ogre.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 200) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 220) {
					var npcWaiting = setInterval(function() {
						new Gyrocopter($('#map'));
						if(level == 10) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 201) {
							$('body').append('<embed src="sound/gyrocopter.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 220) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 240) {
					var npcWaiting = setInterval(function() {
						new Pidgeotto($('#map'));
						if(level == 11) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 221) {
							$('body').append('<embed src="sound/pidgeotto.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 240) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 260) {
					var npcWaiting = setInterval(function() {
						new Behemoth($('#map'));
						if(level == 12) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 241) {
							$('body').append('<embed src="sound/behemoth.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 260) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 280) {
					var npcWaiting = setInterval(function() {
						new Caterpillar($('#map'));
						if(level == 13) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 261) {
							$('body').append('<embed src="sound/caterpillar.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 280) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 300) {
					var npcWaiting = setInterval(function() {
						new MagdaMonster($('#map'));
						if(level == 14) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 281) {
							$('body').append('<embed src="sound/magdamonster.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 300) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 320) {
					var npcWaiting = setInterval(function() {
						new RedDragon($('#map'));
						if(level == 15) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 301) {
							$('body').append('<embed src="sound/reddragon.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 320) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 340) {
					var npcWaiting = setInterval(function() {
						new Gargoyle($('#map'));
						if(level == 16) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 321) {
							$('body').append('<embed src="sound/gargoyle.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 340) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 360) {
					var npcWaiting = setInterval(function() {
						new Goblins($('#map'));
						if(level == 17) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 341) {
							$('body').append('<embed src="sound/goblins.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 360) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 380) {
					var npcWaiting = setInterval(function() {
						new Ogre($('#map'));
						if(level == 18) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;	
						if(npcNum == 361) {
							$('body').append('<embed src="sound/ogre.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 380) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else if(npcNum < 400) {
					var npcWaiting = setInterval(function() {
						new Gyrocopter($('#map'));
						if(level == 19) {
							level++;
							$('#level').text(level);
						}
						npcNum += 1;
						if(npcNum == 381) {
							$('body').append('<embed src="sound/gyrocopter.wav" autostart="true" hidden="true" loop="false">');
						}
						if(npcNum == 400) {
							clearInterval(npcWaiting);
						}
					},1200);
				} else {
					clearInterval(spawnCountdown);
					$('#countdown').text('00');
				}
			} 
			$('#countdown').text(countdown);
		},1000);
		
});