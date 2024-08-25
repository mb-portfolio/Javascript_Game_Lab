//canvas configuration
var canvas = document.querySelector("canvas");
var canvasContext = canvas.getContext("2d");

//
canvas.width = 720;
canvas.height = 560;

//set canvas fill color
canvasContext.fillStyle = "(0, 0, 0)";

//reset canvas to specified fill color
function resetCanvas() {
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

//----------------------------------------------------------------------------------------------------

//clock class
class Clock {
    constructor() {
        this.timestamp = new Date();
        this.hours = this.timestamp.getHours();
        this.minutes = this.timestamp.getMinutes();
        this.seconds = this.timestamp.getSeconds();
        this.hours_string = toString(this.hours);
        this.minutes_string = toString(this.minutes);
        this.seconds_string = toString(this.seconds);
        this.element = document.querySelector("footer");
    }

    //update time
    update() {
        this.timestamp = new Date();
        this.hours = this.timestamp.getHours();
        this.minutes = this.timestamp.getMinutes();
        this.seconds = this.timestamp.getSeconds();
        this.hours_string = this.hours.toString();
        this.minutes_string = this.minutes.toString();
        this.seconds_string = this.seconds.toString();

        //catch and correct numbers under 10 to be formatted with '0' at the beginning
        if (this.hours < 10) {
            this.hours_string = ("0" + this.hours_string);
        }
        if (this.minutes < 10) {
            this.minutes_string = ("0" + this.minutes_string);
        }
        if (this.seconds < 10) {
            this.seconds_string = ("0" + this.seconds_string);
        }
    }

    display() {
        this.element.innerHTML = (this.hours_string + "." + this.minutes_string + "." + this.seconds_string);
    }
}

//clock
var clock = new Clock();

//----------------------------------------------------------------------------------------------------

//audio
var audio = document.querySelector("audio");
audio.loop = true;

//volume slider
var volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener("input", function(event) {
    //volume must be a number between 0 and 1
    audio.volume = event.target.value / 100;
})

//----------------------------------------------------------------------------------------------------

//key down trackers
var w_down = false;
var a_down = false;
var s_down = false;
var d_down = false;

//keydown event listener
document.addEventListener("keydown", function(event) {
    //log event key
    console.log(event.key + " key : down");
    //set key down status
    if (event.key === "w") {
        w_down = true;
    }
    if (event.key === "a"){
        a_down = true;
    }
    if (event.key === "s") {
        s_down = true;
    }
    if (event.key === "d") {
        d_down = true;
    }
})

//keyup event listener
document.addEventListener("keyup", function(event) {
    //log event key
    console.log(event.key + " key : up");
    //set key down status
    if (event.key === "w") {
        w_down = false;
    }
    if (event.key === "a"){
        a_down = false;
    }
    if (event.key === "s") {
        s_down = false;
    }
    if (event.key === "d") {
        d_down = false;
    }
})

//----------------------------------------------------------------------------------------------------

//player class
class Player {
    constructor() {
        this.health = 27;
        this.position_x = (canvas.width / 2) - 20;
        this.position_y = (canvas.height / 2) - 20;
        this.width = 32;
        this.height = 32;
        this.element = document.createElement("img");
        this.element.id = "white-square";
        this.element.src = "images/white-square-32px.png";
        //append element to canvas
        canvas.appendChild(this.element);
    }

    //update position
    updatePosition() {
        if (w_down === true) { 
            this.position_y -= 3;
            if (this.position_y < 0) {
                this.position_y = 0;
            }
        }
        if (a_down === true) {
            this.position_x -= 3;
            if (this.position_x < 0) {
                this.position_x = 0;
            }
        }
        if (s_down === true) {
            this.position_y += 3;
            if (this.position_y > canvas.height - this.height) {
                this.position_y = canvas.height - this.height;
            }
        }
        if (d_down === true) {
            this.position_x += 3;
            if (this.position_x > canvas.width - this.width) {
                this.position_x = canvas.width - this.width;
            }
        }
    }

    //draw player
    draw() {
        canvasContext.drawImage(this.element, this.position_x, this.position_y);
    }
}

//create player object
var player = new Player();

//----------------------------------------------------------------------------------------------------

//red square class
class RedSquare {
    constructor(health) {
        this.health = health;
        this.position_x = (canvas.width / 2) - 200;
        this.position_y = (canvas.height / 2) - 200;
        this.width = 16;
        this.height = 16;
        this.element = document.createElement("img");
        this.element.id = "red-square";
        this.element.src = "images/red-square-16px.png";
        //append element to canvas
        canvas.appendChild(this.element);

        //moving trackers
        this.movingUp = false;
        this.movingDown = false;
        this.movingLeft = false;
        this.movingRight = false;

        //starting direction
        this.movingUp = true;
        this.movingLeft = true;
    }

    //

    //update
    update() {
        //update position
        if (this.movingUp === true) {
            this.position_y -= 3;
        }
        if (this.movingDown === true) {
            this.position_y += 3;
        }
        if (this.movingLeft === true) {
            this.position_x -= 3;
        }
        if (this.movingRight === true) {
            this.position_x += 3;
        }

        //change direction and decrease health if enemy collides with boundary
        if (this.position_y < 0) {
            this.position_y = 0;
            this.movingUp = false;
            this.movingDown = true;
            this.health -= 1;
        }
        if (this.position_y > canvas.height - this.height) {
            this.position_y = canvas.height - this.height;
            this.movingDown = false;
            this.movingUp = true;
            this.health -= 1;
        }
        if (this.position_x < 0) {
            this.position_x = 0;
            this.movingLeft = false;
            this.movingRight = true;
            this.health -= 1;
        }
        if (this.position_x > canvas.width - this.width) {
            this.position_x = canvas.width - this.width;
            this.movingRight = false;
            this.movingLeft = true;
            this.health -= 1;
        }
    }

    //draw enemy
    draw() {
        canvasContext.drawImage(this.element, this.position_x, this.position_y);
    }
}

//enemies class
class Enemies {
    constructor() {
        this.array = []

    }

    //
    spawn_red_squares(waveType, numSquares, speed, health) {
        //
        switch (waveType) {
            case 1 :
                for (let i = 1; i < numSquares + 1; i++) {
                    setTimeout(() => {
                        console.log(i + " red square spawned");
                        this.array.push(new RedSquare(health));
                    }, (speed) * i);
                }
            case 2 :
                
        }
    }

    update() {
        //check all enemies health
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i].health <= 0) {
                this.array.splice(i, 1);
            }
        }

        for (let i = 0; i < this.array.length; i++) {
            this.array[i].update();
        }
    }

    draw() {
        //
        for (let i = 0; i < this.array.length; i++) {
            this.array[i].draw();
        }
    }
}

//create enemies object
var enemies = new Enemies();

//spawn enemy wave - (waveType, numSquares, speed, health)
enemies.spawn_red_squares(1, 10, 1000, 50);
setTimeout(() => {
    console.log("audio started");
    audio.play();
}, 1000);

//----------------------------------------------------------------------------------------------------

//update game objects
function updateGameObjects() {
    //
    clock.update();
    player.updatePosition();
    enemies.update();
}

//draw game objects
function drawGameObjects() {
    //
    resetCanvas();
    clock.display();
    player.draw();
    enemies.draw();
}

//----------------------------------------------------------------------------------------------------

;(() => {

    //main function
    function main() {

        //frame sync
        window.requestAnimationFrame(main);
    
        //game loop
        //console.log(white_box.position_x + "  " + white_box.position_y);
        updateGameObjects();
        drawGameObjects();
    }
  
    //run main
    main();

})();

//----------------------------------------------------------------------------------------------------