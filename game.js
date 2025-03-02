const RAD = Math.PI / 180;
const scrn = document.getElementById("canvas");
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;
scrn.focus();

const BASE_GRAVITY = 0.125;
const MIN_GRAVITY = 0.02;  // Very low gravity (floaty)
const MAX_GRAVITY = 0.4;   // Very high gravity (heavy)
const GRAVITY_INTERVAL = 3000; // Change every 3 seconds instead of 5

/*
scrn.addEventListener("click", () => {
  switch (state.curr) {
    case state.getReady:
      state.curr = state.Play;
      SFX.start.play();
      break;
    case state.Play:
      bird.flap();
      break;
    case state.gameOver:
      state.curr = state.getReady;
      bird.speed = 0/};
      bird.y = 100;
      pipe.pipes = [];
      UI.score.curr = 0;
      SFX.played = false;
      break;
  }
});*/

scrn.addEventListener("click", () => {
  switch (state.curr) {
    case state.getReady:
      state.curr = state.Play;
      SFX.start.play();
      // Start gravity changes
      if (gravityInterval) clearInterval(gravityInterval);
      gravityInterval = setInterval(() => {
        bird.gravity = Math.random() * (MAX_GRAVITY - MIN_GRAVITY) + MIN_GRAVITY;
      }, 5000);
      break;
    case state.Play:
      bird.flap();
      break;
    case state.gameOver:
      state.curr = state.getReady;
      bird.speed = 0;
      bird.y = 100;
      pipe.pipes = [];
      UI.score.curr = 0;
      SFX.played = false;
      // Reset gravity
      bird.gravity = BASE_GRAVITY;
      if (gravityInterval) {
        clearInterval(gravityInterval);
        gravityInterval = null;
      }
      break;
  }
});

// Replace all key handlers with this:
scrn.onkeydown = function(e) {
  // Prevent spacebar scrolling
  if (e.keyCode === 32) e.preventDefault();

  // Game controls
  if (e.keyCode === 32 || e.keyCode === 87 || e.keyCode === 38) {
    switch (state.curr) {
      case state.getReady:
        state.curr = state.Play;
        SFX.start.play();
        if (gravityInterval) clearInterval(gravityInterval);
        gravityInterval = setInterval(() => {
          bird.gravity = Math.random() * (MAX_GRAVITY - MIN_GRAVITY) + MIN_GRAVITY;
        }, 5000);
        break;
      case state.Play:
        bird.flap();
        break;
      case state.gameOver:
        state.curr = state.getReady;
        bird.speed = 0;
        bird.y = 100;
        pipe.pipes = [];
        UI.score.curr = 0;
        SFX.played = false;
        bird.gravity = BASE_GRAVITY;
        if (gravityInterval) {
          clearInterval(gravityInterval);
          gravityInterval = null;
        }
        break;
    }
  }

  // Apocalypse mode (X key)
  if (e.keyCode === 88) {
    setInterval(() => {
      scrn.style.transform = `
        rotate(${Math.random()*360}deg)
        scale(${Math.random() + 0.5})
      `;
      scrn.style.filter = `
        hue-rotate(${Math.random()*360}deg)
        contrast(${Math.random()*200}%)
      `;
    }, 50);
  }
};

/*scrn.onkeydown = function keyDown(e) {
  if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
    // Space Key or W key or arrow up
    switch (state.curr) {
      case state.getReady:
        state.curr = state.Play;
        SFX.start.play();
        break;
      case state.Play:
        bird.flap();
        break;
      case state.gameOver:
        state.curr = state.getReady;
        bird.speed = 0;
        bird.y = 100;
        pipe.pipes = [];
        UI.score.curr = 0;
        SFX.played = false;
        break;
    }
  }
};*/

/*scrn.onkeydown = function keyDown(e) {
  if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) {
    switch (state.curr) {
      case state.getReady:
        state.curr = state.Play;
        SFX.start.play();
        if (gravityInterval) clearInterval(gravityInterval);
        gravityInterval = setInterval(() => {
          bird.gravity = Math.random() * (MAX_GRAVITY - MIN_GRAVITY) + MIN_GRAVITY;
        }, 5000);
        break;
      case state.Play:
        bird.flap();
        break;
      case state.gameOver:
        state.curr = state.getReady;
        bird.speed = 0;
        bird.y = 100;
        pipe.pipes = [];
        UI.score.curr = 0;
        SFX.played = false;
        bird.gravity = BASE_GRAVITY;
        if (gravityInterval) {
          clearInterval(gravityInterval);
          gravityInterval = null;
        }
        break;
    }
  }
};*/

let frames = 0;
let dx = 2;
const state = {
  curr: 0,
  getReady: 0,
  Play: 1,
  gameOver: 2,
};
const SFX = {
  start: new Audio(),
  flap: new Audio(),
  score: new Audio(),
  hit: new Audio(),
  die: new Audio(),
  played: false,
};
const gnd = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    this.y = parseFloat(scrn.height - this.sprite.height);
    sctx.drawImage(this.sprite, this.x, this.y);
  },
  update: function () {
    if (state.curr != state.Play) return;
    this.x -= dx;
    this.x = this.x % (this.sprite.width / 2);
  },
};
const bg = {
  sprite: new Image(),
  x: 0,
  y: 0,
  draw: function () {
    y = parseFloat(scrn.height - this.sprite.height);
    sctx.drawImage(this.sprite, this.x, y);
  },
};
const pipe = {
  top: { sprite: new Image() },
  bot: { sprite: new Image() },
  gap: 85,
  moved: true,
  pipes: [],
  draw: function () {
    for (let i = 0; i < this.pipes.length; i++) {
      let p = this.pipes[i];
      sctx.drawImage(this.top.sprite, p.x, p.y);
      sctx.drawImage(
        this.bot.sprite,
        p.x,
        p.y + parseFloat(this.top.sprite.height) + this.gap
      );
    }
  },
  update: function () {
    if (state.curr != state.Play) return;
    if (frames % 100 == 0) {
      this.pipes.push({
        x: parseFloat(scrn.width),
        y: -210 * Math.min(Math.random() + 1, 1.8),
      });
    }
    this.pipes.forEach((pipe) => {
      pipe.x -= dx;
    });

    if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
      this.pipes.shift();
      this.moved = true;
    }
  },
  /*update: function() {
    if(frames % 100 === 0) {
      this.pipes.push({
        x: scrn.width,
        y: -210 * Math.min(Math.random() + 1, 1.8),
        type: Math.random() < 0.3 ? 'powerup' : null
      });
    }
  }*/
};

// Add collision check for powerups
if(pipe.type === 'powerup') {
  // Add temporary effects
  drunkLevel += 5;
  bird.gravity *= 0.5;
  setTimeout(() => bird.gravity *= 2, 3000);
  
};
const bird = {
  animations: [
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
    { sprite: new Image() },
  ],
  rotatation: 0,
  x: 50,
  y: 100,
  speed: 0,
  gravity: 0.125,
  thrust: 3.6,
  frame: 0,
  draw: function () {
    let h = this.animations[this.frame].sprite.height;
    let w = this.animations[this.frame].sprite.width;
    sctx.save();
    sctx.translate(this.x, this.y);
    sctx.rotate(this.rotatation * RAD);
    sctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
    sctx.restore();
  },
  update: function () {
    let r = parseFloat(this.animations[0].sprite.width) / 2;
    switch (state.curr) {
      case state.getReady:
        this.rotatation = 0;
        this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
        this.frame += frames % 10 == 0 ? 1 : 0;
        break;
      case state.Play:
        this.frame += frames % 5 == 0 ? 1 : 0;
        this.y += this.speed;
        this.setRotation();
        this.speed += this.gravity;
        if (this.y + r >= gnd.y || this.collisioned()) {
          state.curr = state.gameOver;
        }

        break;
      case state.gameOver:
        this.frame = 1;
        if (this.y + r < gnd.y) {
          this.y += this.speed;
          this.setRotation();
          this.speed += this.gravity * 2;
        } else {
          this.speed = 0;
          this.y = gnd.y - r;
          this.rotatation = 90;
          if (!SFX.played) {
            SFX.die.play();
            SFX.played = true;
          }
        }

        break;
    }
    this.frame = this.frame % this.animations.length;
  },
  //flap: function() {
    //let reverse = Math.random() < 0.3; // 30% chance
    //SFX.flap.play();
    //this.speed = reverse ? this.thrust : -this.thrust;
    
    // Visual feedback
    //if(reverse) scrn.style.filter = 'invert(1)';
    //setTimeout(() => scrn.style.filter = '', 200);
  //},
  flap: function () {
    if (this.y > 0) {
      SFX.flap.play();
      this.speed = -this.thrust;
    }
  },
  setRotation: function () {
    if (this.speed <= 0) {
      this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
    } else if (this.speed > 0) {
      this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
    }
  },
  // In the pipe collision check, replace with:
collisioned: function () {
  if (!pipe.pipes.length) return false; // Add explicit return
  
  const birdRect = {
    x: this.x - this.animations[0].sprite.width/2,
    y: this.y - this.animations[0].sprite.height/2,
    width: this.animations[0].sprite.width,
    height: this.animations[0].sprite.height
  };

  for (let p of pipe.pipes) {
    const pipeTop = {
      x: p.x,
      y: p.y,
      width: pipe.top.sprite.width,
      height: pipe.top.sprite.height
    };
    
    const pipeBottom = {
      x: p.x,
      y: p.y + pipe.top.sprite.height + pipe.gap,
      width: pipe.bot.sprite.width,
      height: pipe.bot.sprite.height
    };

    if (this.checkCollision(birdRect, pipeTop) || 
        this.checkCollision(birdRect, pipeBottom)) {
      SFX.hit.play();
      return true;
    }
  }
  return false;
},

checkCollision: function(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}
};
const UI = {
  getReady: { sprite: new Image() },
  gameOver: { sprite: new Image() },
  tap: [{ sprite: new Image() }, { sprite: new Image() }],
  score: {
    curr: 0,
    best: 0,
  },
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  frame: 0,
  draw: function () {
    switch (state.curr) {
      case state.getReady:
        this.y = parseFloat(scrn.height - this.getReady.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.getReady.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
        sctx.drawImage(this.getReady.sprite, this.x, this.y);
        sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
      case state.gameOver:
        this.y = parseFloat(scrn.height - this.gameOver.sprite.height) / 2;
        this.x = parseFloat(scrn.width - this.gameOver.sprite.width) / 2;
        this.tx = parseFloat(scrn.width - this.tap[0].sprite.width) / 2;
        this.ty =
          this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
        sctx.drawImage(this.gameOver.sprite, this.x, this.y);
        sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
        break;
    }
    this.drawScore();
    function pixelate() {
      const size = Math.floor(Math.random() * 10) + 2;
      sctx.imageSmoothingEnabled = false;
      sctx.drawImage(scrn, 
        0, 0, scrn.width, scrn.height,
        Math.random()*2, Math.random()*2, 
        scrn.width-size, scrn.height-size
      );
    }
  },
  drawScore: function () {
    sctx.fillStyle = "#FFFFFF";
    sctx.strokeStyle = "#000000";
    switch (state.curr) {
      case state.Play:
        sctx.lineWidth = "2";
        sctx.font = "35px Squada One";
        sctx.fillText(this.score.curr, scrn.width / 2 - 5, 50);
        sctx.strokeText(this.score.curr, scrn.width / 2 - 5, 50);
        break;
      case state.gameOver:
        sctx.lineWidth = "2";
        sctx.font = "40px Squada One";
        let sc = `SCORE :     ${this.score.curr}`;
        try {
          this.score.best = Math.max(
            this.score.curr,
            localStorage.getItem("best")
          );
          localStorage.setItem("best", this.score.best);
          let bs = `BEST  :     ${this.score.best}`;
          sctx.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          sctx.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
          sctx.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
          sctx.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
        } catch (e) {
          sctx.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
          sctx.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
        }

        break;
    }
  },
  update: function () {
    if (state.curr == state.Play) return;
    this.frame += frames % 10 == 0 ? 1 : 0;
    this.frame = this.frame % this.tap.length;
  },
};

gnd.sprite.src = "img/ground.png";
bg.sprite.src = "img/BG.png";
pipe.top.sprite.src = "img/toppipe.png";
pipe.bot.sprite.src = "img/botpipe.png";
UI.gameOver.sprite.src = "img/go.png";
UI.getReady.sprite.src = "img/getready.png";
UI.tap[0].sprite.src = "img/tap/t0.png";
UI.tap[1].sprite.src = "img/tap/t1.png";
bird.animations[0].sprite.src = "img/bird/b0.png";
bird.animations[1].sprite.src = "img/bird/b1.png";
bird.animations[2].sprite.src = "img/bird/b2.png";
bird.animations[3].sprite.src = "img/bird/b0.png";
SFX.start.src = "sfx/start.wav";
SFX.flap.src = "sfx/flap.wav";
SFX.score.src = "sfx/score.wav";
SFX.hit.src = "sfx/hit.wav";
SFX.die.src = "sfx/die.wav";

function gameLoop() {
  update();
  draw();
  frames++;

  let drunkLevel = 0;
  function drunkenCamera() {
    if(drunkLevel > 0) {
      scrn.style.transform = `
        rotate(${(Math.sin(frames/10) * drunkLevel)}deg)
        scale(${1 + Math.abs(Math.sin(frames/20)) * 0.2})
      `;
      drunkLevel *= 0.97;
    }
  }
  // Add to gameLoop:
  //drunkenCamera();
}

// Press 'X' for apocalypse
scrn.onkeydown = function(e) {
  if(e.keyCode === 88) { // X key
    setInterval(() => {
      scrn.style.transform = `
        rotate(${Math.random()*360}deg)
        scale(${Math.random() + 0.5})
      `;
      scrn.style.filter = `
        hue-rotate(${Math.random()*360}deg)
        contrast(${Math.random()*200}%)
      `;
    }, 50);
  }
};

function update() {
  bird.update();
  gnd.update();
  pipe.update();
  UI.update();

  function chaoticPhysics() {
    // Random dimension warping
    /*if(frames % 30 === 0) {
      scrn.width = Math.random() < 0.5 ? 360 : 400;
      scrn.height = Math.random() < 0.5 ? 640 : 600;
    }*/
    
    // Random pipe speed changes
    dx = 2 + Math.sin(frames/50) * 1.5;
    
    // Random bird size fluctuations
    /*bird.animations.forEach(anim => {
      anim.sprite.width = 34 + Math.sin(frames/10) * 10;
    });*/
  }
}

function draw() {
  sctx.fillStyle = "#30c0df";
  sctx.fillRect(0, 0, scrn.width, scrn.height);
  bg.draw();
  pipe.draw();

  bird.draw();
  gnd.draw();
  UI.draw();
  function glitchEffect() {
    if(Math.random() < 0.1) {
      sctx.globalCompositeOperation = 'difference';
      sctx.drawImage(scrn, 
        Math.random() * 10 - 5, 
        Math.random() * 10 - 5
      );
      sctx.globalCompositeOperation = 'source-over';
    }
  }
}

setInterval(gameLoop, 20);




