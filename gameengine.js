window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();



//function canvasLoaded(){

//}


function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    this.lclick = false;
    this.pointerx = 50;
    this.pointery = 50;
    this.pointerLocked = false;
    // this.showOutlines = true;
    this.showOutlines = false;
    this.camera = null;
    this.player = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.rect = this.ctx.canvas.getBoundingClientRect();
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function (player, camera) {
    this.player = player;
    this.camera = camera;
    var that = this;
    var canvas = this.ctx.canvas;
    var mousePositionUpdate = function(e) {
        var dx = e.movementX;
        var dy = e.movementY;
        if(that.pointerx + dx>that.player.x - canvas.width/2 && that.pointerx + dx<that.player.x + canvas.width/2){
            that.pointerx += dx;
        }
        if(that.pointery + dy>that.player.y - canvas.height/2 && that.pointery + dy<that.player.y + canvas.height/2){
            that.pointery += dy;
        }
        document.getElementById("debug-out").innerHTML = `Pointer Coordinates: x-${that.pointerx}, y-${that.pointery}`;
        // that.pointerx += dx;
        // that.pointery += dy;
    }
    document.addEventListener('pointerlockchange', () => {
        if(document.pointerLockElement === canvas){
            document.addEventListener("mousemove", mousePositionUpdate);
            that.pointerLocked = true;
        } else {
            document.removeEventListener("mousemove", mousePositionUpdate);
            that.pointerLocked = false;
        }
    });
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;
    var getXandY = function(evt) {
        return {
            x: (evt.clientX - that.rect.left) / (that.rect.right - that.rect.left)* that.ctx.canvas.width,
            y: (evt.clientY - that.rect.top) / (that.rect.bottom - that.rect.top) * that.ctx.canvas.height
        };
    }

    this.ctx.canvas.addEventListener("mousedown", (e) => {
        that.lclick = true;
    });

    this.ctx.canvas.addEventListener("mouseup", (e) => {
        that.lclick = false;
    });

    this.ctx.canvas.addEventListener("keydown", (e) => {
        that.handleInputs(e.code, true);
    });
    this.ctx.canvas.addEventListener("keyup", (e) => {
        that.handleInputs(e.code, false);
    });

}

GameEngine.prototype.handleInputs = function(keycode, value){
    switch(keycode){
        case "KeyW":
            this.w = value;
            break;
        case "KeyA":
            this.a = value;
            break;
        case "KeyS":
            this.s = value;
            break;
        case "KeyD":
            this.d = value;
            break;
    }    
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    this.camera.draw();
    for (var i = 0; i < this.entities.length; i++) {
        if(!this.entities[i].removeFromWorld){
            this.entities[i].draw(this.ctx);
        }
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;
    this.camera.update();
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if(!entity.removeFromWorld){
            entity.update();
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image.img, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    return offscreenCanvas;
}