// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.id = "game-block";
document.getElementById("game-wrapper").appendChild(canvas);
document.getElementById("youWinHeader").classList.add("hidden");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
  bgReady = true;
};
bgImage.src = "img/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
  heroReady = true;
};
heroImage.src = "img/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
  monsterReady = true;
};
monsterImage.src = "img/monster.png";

// Game objects
var hero = {
  speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;
var monstersCaughtLimit = 4;
var tunelCross = 0;
var winer = false;
var monstersCaughtLimitSet = monstersCaughtLimit;
document.getElementById("MonstersLimit").value = ""

// Handle keyboard controls
var keysDown = {};

addEventListener(
  "keydown",
  function(e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function(e) {
    delete keysDown[e.keyCode];
  },
  false
);

// Reset the game when the player catches a monster
var reset = function() {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + Math.random() * (canvas.width - 64);
  monster.y = 32 + Math.random() * (canvas.height - 64);
  document.getElementById("youWinHeader").classList.add("hidden");
  keysDown = {};
};

var saveNewLimit = function() {
  monstersCaughtLimitSet = document.getElementById("MonstersLimit").value;
  keysDown = {};
  document.getElementById("MonstersLimit").value = "";
  
  var input = document.getElementById("MonstersLimit");
  input.placeholder = `Monster Limit is ${monstersCaughtLimitSet} now`;

  reset();
  main();
};

// Update game objects
var update = function(modifier) {
  if (
    monstersCaughtLimitSet == 0 ||
    monstersCaughtLimitSet == null ||
    monstersCaughtLimitSet == "" ||
    isNaN(monstersCaughtLimitSet)
  ) {
    // console.log("IFFF "+monstersCaughtLimitSet);
  } else {
    // console.log("ELSEE "+monstersCaughtLimitSet);
    monstersCaughtLimit = monstersCaughtLimitSet;
  }

  if (winer) {
    setTimeout(function() {
      alert("Congratulation, You Win!");
    }, 1);
    reset();
    //  console.log("WINER flag is " + winer);
    document.getElementById("youWinHeader").classList.remove("hidden");
  }

  if (38 in keysDown) {
    // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    // Player holding right
    hero.x += hero.speed * modifier;
  }

  // Has the hero reached the tree line?
  // Are they out of screen
  if (hero.x <= 30) {
    hero.x = canvas.width - 60;
    ++tunelCross;
  } else if (hero.y <= 30) {
    hero.y = canvas.height - 60;
    ++tunelCross;
  } else if (hero.x >= canvas.width - 60) {
    hero.x = 31;
    ++tunelCross;
  } else if (hero.y >= canvas.height - 60) {
    hero.y = 31;
    ++tunelCross;
  }

  // Are they touching?
  /*
  if (
    hero.x <= 30 ||
    hero.y <= 30 ||
    hero.x >= canvas.width - 60 ||
    hero.y >= canvas.height - 60
  ) {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
  }
  */
  if (monstersCaught >= monstersCaughtLimit) {
    winer = true;
    document.getElementById("youWinHeader").classList.remove("hidden");
    stopGame();
  }

  if (
    hero.x <= monster.x + 32 &&
    monster.x <= hero.x + 32 &&
    hero.y <= monster.y + 32 &&
    monster.y <= hero.y + 32
  ) {
    ++monstersCaught;
    reset();
  }
};

// Draw everything
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  //console.log(Math.floor(hero.x),Math.floor(hero.y));

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "16px Open Sans, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
  ctx.fillText("Tunnel passes: " + tunelCross, 32, 50);
};

// The main game loop
var main = function() {
  var now = Date.now();
  var delta = now - then;
  update(delta / 1000);
  winer = false;
  render();
  then = now;
  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Here stopGame and reset counters if you win game
var stopGame = function() {
  monstersCaught = 0;
  tunelCross = 0;
  document.getElementById("youWinHeader").classList.remove("hidden");
  keysDown={};
  reset();
  restartGame();
  };

// Here restart the game and reset counters
var restartGame = function() {
  monstersCaught = 0;
  tunelCross = 0;
  document.getElementById("youWinHeader").classList.add("hidden");
  //console.log('you come in Restart_GAME___winner_is__' + winer);
  reset();
  main();
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
