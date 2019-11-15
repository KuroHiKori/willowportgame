//initial/root variables

//setup object
var canvas, stage;

//text object
var titleField;

//charicter and game objects
var willow;

//backgrounds
var shy, clouds, mountans, trees, ground;

var groundWidth;

//game parameters (eg. velocity, speed, gravity, etc.)
var xv = 0;
var yv = 0;
var speed = 3;
var gravidy = .2;
var jumpPower = -5;

//paramiters for limiting movement
var leftlimit = 200;
var rightlimit = 600;
var groundlevel = 500;

//boolians
var walking = false;
var walkJump = false;
var crouch = false;
var atEnd = false;

//initialixation function

function init(){

    //canvas & createjs setup
    canvas = document.getElementById("gameCanvas");
    
    stage = new createjs.Stage(canvas);
    
    //preload assests, call other setup functions etc.
    
    //sounds
    loadSounds();
    
    addBackgrounds();
    
    addwillow();
    
    //setup the "Ticker" loop (essentialy the game engine)
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onTick);
    
    //add any initial event listeners
    document.addEventListener("keydown",onKeyDown);
    document.addEventListener("keyup",onKeyUp);
    
}

//SOUND FUNCTION!!!!!
// THIS NEEDS TO BE FIXED!

function loadSounds () {
    console.log("sounds...");
    
    //sound found at https://freesound.org/people/LloydEvans09/sounds/187025/
    //console.log(createjs.Sound);
    createjs.Sound.registerSound("sound/jump_01.mp3", "jumpSound");
    
    //sound found at https://freesound.org/people/InspectorJ/sounds/345560/
    createjs.Sound.registerSound("sound/walking_01.mp3", "walkingSound");
}

//setup functionality 

function addBackgrounds(){
    
    sky = new createjs.Bitmap("images/sky.png");
    stage.addChild(sky);
    
    clouds = new createjs.Bitmap("images/clouds.png");
    clouds.y = -100;
    stage.addChild(clouds);
    
    mountans = new createjs.Bitmap("images/mountans.png");
    mountans.y = 100;
    stage.addChild(mountans);
    
    trees = new createjs.Bitmap("images/trees.png");
    stage.addChild(trees);
    
    ground = new createjs.Bitmap("images/ground.png");
    ground.y = 370;
    stage.addChild(ground);
    
    ground.image.onload = function(){
        console.log("Ground loaded and the width is "+ground.image.width);
        groundWidth = ground.image.width;
    }
    
}

function addwillow(){
   console.log("Adding in the charicter..."); 
    
    //create a new instane of the charicter spritesheet
    willow = new Willow();
    
    //start in the nothing position
    willow.nothing();
    
    willow.x = 400;
    willow.y = 550;
    stage.addChild(willow);
    
    //set animation to play when other finishes
    //eg. go to resting after a jump
    
    Willow._SpriteSheet.getAnimation("walkJump").next = "nothing";
    Willow._SpriteSheet.getAnimation("standFromCrawl").next = "nothing";
    
}

function onTick(){
    console.log();
    
    //the valosity paramiters
    willow.x += xv;
    willow.y += yv;
    
    
    ground.x -= xv;
    
    if(atEnd == false){
    //make the background move
        clouds.x -= xv/40;
        mountans.x -= xv/20;
        trees.x -= xv/10;
    }
    
    //are you at the end?
    console.log("ground.x = "+ground.x);
    if(ground.x < -2763){
        ground.x = -2763;
        atEnd = true;
    } else if(ground.x > 1){
        ground.x = 1;
        atEnd = true;
    } else {
        atEnd = false;
    }
    
    //chalculate chaticter valosity for movement
    
    //continually add gravity to the charicter so that they do not float way
    
    yv += gravidy;
    
    //set movement limits
    
    if (willow.x < leftlimit){
       //if willow has pased limit, then push them back to the limit
        willow.x = leftlimit;
        
    } else if(willow.x > rightlimit){
        //if willow gose past the right limit on the other hand
        willow.x = rightlimit;   
    }
    
    //set ground limit
    if (willow.y > groundlevel){
        willow.y = groundlevel;
        walkJump = false;
  
    }
    
    //update stage
    stage.update();
    
}

/* willow WALK */

function onKeyDown(e){
    console.log("Key Down!" + e.keyCode);
    if(e.keyCode == 37){
        //turn left with scaleX
        
        if(walking == false){
            xv = -speed;
        
            willow.scaleX = -1;
            willow.walk();
            walking = true;
            //willow.x -= 5;
            
            //sound wont play because createjs for some reason plays everything but the sounds
            createjs.Sound.play("walkingSound", {loop: -1});
            walking = true;
        }
        
    } else if (e.keyCode == 39){
        //right
        if(walking == false){
            willow.scaleX = 1;
            xv = speed;
            willow.walk();
            walking = true;
            //willow.x += 5;  
            
            //same problem with all the sounds as of now
            createjs.Sound.play("walkingSound", {loop: -1});
            walking = true;
        }
        
    }
    
    else if(e.keyCode == 40){
            //crouch
    
        if(crouch == false){
            
            createjs.Sound.stop();
            
            willow.crouch();
            crouch = true;    
        }

    }
    
    /* willow JUMP */

    else if(e.keyCode == 38){
    //jump code
    
        if(walkJump == false){
            
            //this wont work because of the sound problem and if not comented out then it will make it so that the jump can not play
            createjs.Sound.stop();
            
            yv = jumpPower;
            willow.walkJump();
            walkJump = true;
            
            //this wont play for the same reason as the walking sound
            createjs.Sound.play("jumpSound");
            
        }
        
    }
    
}

function onKeyUp(e){
    console.log("Key Up!" + e.keyCode);
    
    if(e.keyCode == 37){
        //left
        xv = 0;
        //go back to nothing
        willow.nothing();
        createjs.Sound.stop();
        //update
        walking = false;
        
    } else if(e.keyCode == 39){
        //right
        xv = 0;
        
        willow.nothing();
        walking = false;
        createjs.Sound.stop();
    } else if(e.keyCode == 40){
            //crouch
    
        if(crouch == true){
            
            createjs.Sound.stop();
            
            willow.standFromCrawl();
            crouch = false;    
        }

    }
    
}

 
        







