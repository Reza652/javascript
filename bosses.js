

midPoint = {x:5475, y:1965};



function generateRandomNumber(min , max) 
{
    return Math.random() * (max-min) + min ;
} 

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function shadowBoss(game,locationsheet, movementsheet,attacksheet) {
    this.locationAnimation = new Animation(locationsheet,82,75,1,.09,false,2);
    this.animation = new Animation(movementsheet,82,75,17,.09,17,true,2);
    this.attackAnimation = new Animation(attacksheet,82,75,31,.1,31,true,2);
    this.attackVision = 200;
    this.radius = 20
    this.attack = false;
    this.ctx = game.ctx;
    this.speed = 10;
    this.location = false;
    this.endPoint = {x:6200, y:2055};
    this.startPoint = {x:4700, y:1875};
    this.velocity = { x: generateRandomNumber(this.startPoint.x , this.endPoint.x) , 
        y: generateRandomNumber(this.startPoint.y , this.endPoint.y)};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    Entity.call(this, game, 5600, 1797);

    
}

shadowBoss.prototype = new Entity();
shadowBoss.prototype.constructor = shadowBoss;

RangeSkeleton.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

RangeSkeleton.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

RangeSkeleton.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

RangeSkeleton.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

RangeSkeleton.prototype.collideBottom = function () {
    return (this.y + this.radius) > 650;
};
/*

shadowBoss.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent != this && ent instanceof Player) {
            if (this instanceof shadowBoss) {
                dis = distance(this,ent);
                if (ent != this && dis <= this.attackVision ) {
                    this.attack = true;
                    this.location = false;
                } else {
                    this.location = true;
                    this.attack = false;
                    this.x += this.game.clockTick * this.velocity;
                    this.y += this.game.clockTick * this.velocity;
                    if(this.x > this.endPoint.x){
                        
                        this.x = ent.x + Math.floor(Math.random() * 100);
                    }
                    if(this.y > this.endPoint.y){
                        this.y = ent.y + Math.floor(Math.random() * 100);
                    }
                }
            } 
        }
    }
    
    console.log("the x value",this.x);
    console.log("the y value",this.y);
    console.log("the velocity x value",this.velocity.x);
    console.log("the velocity x value",this.velocity.y);

    console.log("player x value",ent.x);
    console.log("player y value",ent.y);
   // console.log("player velocity x value",ent.velocity.x);
   // console.log("player velocity y value",ent.velocity.y);

    Entity.prototype.update.call(this);
}*/


shadowBoss.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent != this && ent instanceof Player) {
            if (this instanceof shadowBoss) {
                dis = distance(this,ent);
                if (ent != this && dis <= this.attackVision ) {
                    this.attack = true;
                    this.location = false;
                } else {
                    this.location = true;
                    this.attack = false;
                    this.x += this.game.clockTick * this.speed;
                    this.y += this.game.clockTick * this.speed;
                    if(this.x > this.endPoint.x){
                        this.x = this.startPoint.x + Math.floor(Math.random() * 100);
                    }
                    if(this.y > this.endPoint.y){
                        this.y = this.startPoint.y + Math.floor(Math.random() * 100);
                    }
                }
            } 
        }
    }
    
    
    console.log("the x value",this.x);
    console.log("the y value",this.y);

    Entity.prototype.update.call(this);
}


shadowBoss.prototype.draw = function () {
    if(this.location) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        this.location = false;
    }else{
        this.attackAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        this.attack = false;
    }
    //this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
   // this.locationAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}



/*

function wall(game,sprite) {
    this.wallAnimation = new Animation(sprite,30,100, 240,300,.1,21,true,1);
    //this.halfAnimation = new AnimationB(sprite,30,100, 240,300,.1,8,false,1);
    //this.fullAnimation = new AnimationB(sprite,30,100, 240,300,.1,8,true,1);
    
    this.begin = false;
    this.continue = false;
    this.ctx = game.ctx;
    this.starty = 2400;
    Entity.call(this, game, 5436, 2400);
}
wall.prototype = new Entity();
wall.prototype.constructor = wall;

wall.prototype.update = function () {
    this.x = 5436;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if(ent != this && ent instanceof Player && ent.x < this.startx  && ent.y < this.y ) {
            if(this instanceof wall) {
                this.begin = true;
            }else{
                this.begin = false;
            }
            console.log("the value of x",ent.velocity.x);
            console.log("the value of y",ent.y);
            console.log("x value of the wall", this.x)
             
        }
    }
  Entity.prototype.update.call(this);
}

wall.prototype.draw = function () {
    if(this.begin) {
        this.wallAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
        //this.halfAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
        //this.fullAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1.5);
       // this.begin = false;
        //this.continue = true;
    //}else if(this.continue) {
      //  this.fullAnimation.drawFrameFromRow(this.game.clockTick, this.ctx, this.x, this.y, 1.5,3);
    }
    Entity.prototype.draw.call(this);
}*/

var friction = 1;
var acceleration = 1000000;
var maxSpeed = 100;

