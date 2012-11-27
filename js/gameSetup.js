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

// - Display the starting information
	$(function() { 
		$('#lives').text(lives);
		$('#level').text(level);
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
			$(this).css('background-image','');
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
		
		// The map element
		this.root = element;
		
		// - Set up the container DIV for this character
		this.container = $('<div class="npc"></div>');
		this.container.appendTo('#map');
		
		// - Set the offset of the character to the spawn point
		$(this.container).css('left',spawnPoint+'px');
		
		// - TEMPORARY click to kill unit
		$(this.container).click(function() {
			death($(this));
		});
		
		// - Detects if this object is hit
		this.hitTest = function(thisObject) {
			
		}
		
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
						death(thisObject);
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
		
		thisObject.addClass('skeleton');
		thisObject.sprite({fps: 9, no_of_frames: 6});
		thisObject.spState(1);
		
		this.move($(this.container),this.speed,0);
		this.hitTest($(this.container));
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
		this.hitTest(thisObject);
	}
	Warrior.prototype = new Npc;
	
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
			var testInterval = setInterval(function() {
				if(inter < 6) {
					var backgroundPosition = parseInt(thisObject.css('background-position').split('px')[0])-parseInt(thisObject.css('width'));
					thisObject.css('background-position',backgroundPosition+'px');
					inter++;
				} else {
					clearInterval(testInterval);
					self.attack();
				}
			}, 1000);
		}
		
		this.attack = function() {
			var shootingInterval = setInterval(function() {
				
				new Arrow(self.container);
				
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

// !! ------------------------- Projectile ------------------------- !! //

	function Arrow(element) {
		// - "this" to be used in functions
		var self = this;
		
		// - Projectile container
		this.projectile = $('<div id="arrow" class="arrow"></div>');
		
		// - Append projectile to map
		element.append(this.projectile);
		
		// - The starting point to determine the distance traveled
		var startingPoint = parseInt(self.projectile.css('left').split('px')[0]);
		var rotation = 0;
	
		// - Get the nearest NPC
		var npc = $('.npc');
		var width = 0;
		var height = 0;
		var angle = 0;
		var shortestDistance = 9999;
		var npcX = 0;
		var npcY = 0;
		var elementX = parseInt(element.css('left').split('px')[0]);
		var elementY = parseInt(element.css('top').split('px')[0]);
		$('.npc').each(function() {
			var thisX = parseInt($(this).css('left').split('px')[0]);
			var thisY = parseInt($(this).css('top').split('px')[0]);			
			
			var width = thisX - elementX;
			var height = thisY - elementY;
			
			var distance = Math.sqrt((width*width)+(height*height));
			
			if(distance < shortestDistance) {
				shortestDistance = distance;
				npc = $(this);
				angle = ((Math.atan(height/width)) * 180) / Math.PI;
				npcY = thisY;
				npcX = thisX;
			} else {
				shortestDistance = 9999;
			}
			
		});

		npc.css('background-color','#fff');
		if(height < 0) {
			rotation = angle;
		} else {
			rotation = angle;
		}
			
			
			
		this.projectile.css('-moz-transform','rotate('+rotation+'deg)');
		var moveIt = setInterval(function() {
			var leftMove = (npcX - elementX) / 10;
			var topMove = (npcY - elementY) / 10;
			var thisLeft = parseInt(self.projectile.css('left').split('px')[0])+leftMove;
			var thisTop = parseInt(self.projectile.css('top').split('px')[0])+topMove;
			
			if(thisLeft > (startingPoint+180)) {
				self.projectile.remove();
				clearInterval(moveIt);
			} else {
				self.projectile.css('left',thisLeft+'px');
				self.projectile.css('top',thisTop+'px');
			}
		},30);
	}
	
// !! --------------------- Generate the NPC's --------------------- !! //

	$(function() { 
		var npcNum = 0;
		var npcWaiting = setInterval(function() {
			if(npcNum < 10) {
				new Skeleton($('#map'));
				npcNum += 1;
			} else if(npcNum < 20) {
				if(lives <= 19) {
					if(level == 1) {
						level = 2;
						$('#level').text(level);
					}
					new Warrior($('#map'));
					npcNum += 1;
				}
			}
		},1200);
		
		k = 1;
		var towerWait = setInterval(function() {
			if(k==2||k==18||k==34||k==35||k==36||k==52||k==68||k==84||k==83||k==82||k==98||k==114||k==130||k==131||k==132||k==133||k==134||k==135||k==136||k==137||k==138||k==139||k==140||k==141||k==142||k==143||k==127||k==111||k==95||k==79||k==78||k==77||k==76||k==92||k==108||k==107||k==106||k==90||k==74||k==73||k==72||k==88||k==104||k==103||k==102||k==142||k==70||k==54||k==38||k==22||k==23||k==24||k==25||k==41||k==42||k==43||k==44||k==45||k==29||k==30||k==31||k==32||k==86) {
			} else {
				new Tower1($('#zone'+k));
			}
			k += 16;
		},5000);
		
		//new Tower($('#zone53'));
		//new Tower($('#zone33'));
	});
	