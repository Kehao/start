var img;
var copy;
var copycanvas;
var draw;
var TILE_WIDTH = 8;
var TILE_HEIGHT = 10;
var TILE_CENTER_WIDTH = 4;
var TILE_CENTER_HEIGHT = 5;
var SOURCERECT = {x:0, y:0, width:0, height:0};
var PAINTRECT = {x:0, y:0, width:1800, height:1200};
var RAD = Math.PI/180;
var tiles = [];
var intl;
var r = 1;
var over = true;
var overTriggered = false;
var play = false;

$(document).keydown(function(event){ 
    if(play) {
        return false;
    }
    if(event.keyCode == 83){ 
            $('.q3').fadeIn(2000);

        window.setTimeout(function(){
            $('.q2').fadeIn(2000);
        }, 1000);

        window.setTimeout(function(){
            $('.q1').fadeIn(2000);
        }, 3000);
    } 
}); 

function init(){
    play = true;
	img = document.getElementById('sourcevid');
	copycanvas = document.getElementById('sourcecopy');
	copy = copycanvas.getContext('2d');
	var outputcanvas = document.getElementById('output');
	draw = outputcanvas.getContext('2d');

	draw.clearRect(PAINTRECT.x, PAINTRECT.y,PAINTRECT.width,PAINTRECT.height);
    SOURCERECT = {x:0, y:0, width:0, height:0};
    if(SOURCERECT.width == 0){
        SOURCERECT = {x:0,y:0,width:img.width,height:img.height};
        createTiles();
    }
	copy.drawImage(img, 0, 0);

    if (intl) {
       window.clearInterval(intl);
    }
	intl = setInterval("processFrame()", 33);
    $('body').on('animate-over', function() {
        window.clearInterval(intl);
          $('.text').fadeIn(500);
    });

}

$(document).keydown(function(event){ 
    if(event.keyCode == 71){ 
        if(!play) {
            init();    
            window.setTimeout(function(){
                if (intl) {
                    window.clearInterval(intl);
                }
            }, 20000);
        }
    } 
}); 

function createTiles(){
	var offsetX = TILE_CENTER_WIDTH+(PAINTRECT.width-SOURCERECT.width)/2;
	var offsetY = TILE_CENTER_HEIGHT+(PAINTRECT.height-SOURCERECT.height)/2;
	var y=0;
	while(y < SOURCERECT.height){
		var x=0;
		while(x < SOURCERECT.width){
			var tile = new Tile();
			tile.x = x;
			tile.y = y;
			tile.originX = offsetX+x;
			tile.originY = offsetY+y;
			tile.currentX = getRandom(PAINTRECT.width * r, PAINTRECT.width * r);
			tile.currentY = getRandom(PAINTRECT.height * r, PAINTRECT.height * r);
            tile.angle = getRandom(0, 360); //getRandom(0, 359);
			tiles.push(tile);
			x+=TILE_WIDTH;
		}
		y+=TILE_HEIGHT;
	}
}

function processFrame(){
    over = true;
	draw.clearRect(PAINTRECT.x, PAINTRECT.y,PAINTRECT.width,PAINTRECT.height);
	for(var i=0; i<tiles.length; i++){
		var tile = tiles[i];
        if (tile.currentX != tile.originX || tile.currentY != tile.originY) {
            over = false;
        }
        draw.save();
		draw.translate(tile.currentX, tile.currentY);
		draw.drawImage(copycanvas, tile.x, tile.y, TILE_WIDTH, TILE_HEIGHT, -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
		draw.restore();
		var _x = Math.abs(tile.originX - tile.currentX);
		var _y = Math.abs(tile.originY - tile.currentY);
		//var diffRot = (0-tile.rotation)*0.2;

        var distance = Math.sqrt(_x*_x + _y*_y) - 4;
        if (Math.abs(tile.originX - tile.currentX) < 4 && Math.abs(tile.originY - tile.currentY) < 4) {
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
        } else {
			tile.currentX = tile.originX + distance*Math.cos(tile.angle*(Math.PI/180));
			tile.currentY = tile.originY + distance*Math.sin(tile.angle*(Math.PI/180));
        }

        tile.angle +=1;
        if(tile.angle>360) { 
             tile.angle = 0;//getRandom(0, 359);
         }
			
		
	}
    if (!overTriggered && over) {
       $('body').trigger('animate-over'); 
    }
}

function getRandom(a, b) {
    return Math.random() * (b - a) + a
}

function Tile(){
	this.originX = 0;
	this.originY = 0;
	this.currentX = 0;
	this.currentY = 0;
	this.rotation = 0;
	this.force = 0;
	this.z = 0;
	this.moveX= 0;
	this.moveY= 0;
	this.moveRotation = 0;
	
	this.x = 0;
	this.y = 0;
}
