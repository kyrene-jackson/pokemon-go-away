// create 'main' state that will contain the game

var mainState = {
  preload: function() {
    // executed at the begining
    // load images and sounds

    // load the bird sprite
    // game.load.image('bird', 'assets/bird.png');
    game.load.image('background', 'assets/bg3.png')
    game.load.image('pipe', 'assets/pokeball.png');
    game.load.audio('jump', 'assets/jump.wav');
    //34, 24, 3
    game.load.spritesheet('bird', 'assets/pikachuspritesheet.png', 58.75, 42, 4);
    game.load.image('ground', 'assets/ground2.png');

  },

  create: function() {
    // called after preload
    // set up for the game, display sprites, etc.





    // set jump sound
    this.jumpSound = game.add.audio('jump');
    // set background color
    // game.stage.backgroundColor = '#71c5cf';
    this.background = this.game.add.sprite(0, 0, 'background')

    // add the ground
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    this.ground.autoScroll(-300, 0);

    // set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // display the bird at the position x=100 and y-245 // 200, 5
    this.bird = game.add.sprite(100, 5, 'bird');

    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 10, true);

    // add physics to the bird (movement, gravity, collisions, etc.)
    game.physics.arcade.enable(this.bird);

    // add gravity to make it fall
    this.bird.body.gravity.y = 1000;

    // create an empty group
    this.pipes = game.add.group();

    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(this.jump, this);

      this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

      this.score = 0;
      this.labelScore = game.add.text(20, 20, "0",
      { font: "30px Arial", fill: "#ffffff" });

      // Move the anchor to the left and downward
      this.bird.anchor.setTo(-0.2, 0.5);
  },

  update: function() {
    // called 60 times per second
    // contains game logic
    if (this.bird.y < 0 || this.bird.y > 490)
    this.restartGame();

    game.physics.arcade.overlap(
    this.bird, this.pipes, this.hitPipe, null, this);

    // bird rotates downward and when it jumps, rotates upward
    if (this.bird.angle < 20)
    this.bird.angle += 1;
  },

// make the bird jump
jump: function() {
  this.bird.body.velocity.y = -350;
  game.add.tween(this.bird).to({angle: -20}, 100).start();
  this.jumpSound.play();

},

// restart the game
restartGame: function() {
  // start the main state
  game.state.start('main');
  },

addOnePipe: function(x, y) {
  // create a pipe at the position x and y
  var pipe = game.add.sprite(x, y, 'pipe');

  // add the pipe to previously created group
  this.pipes.add(pipe);

  // Enable physics on the pipe
  game.physics.arcade.enable(pipe);

  // add velocity to the pipe to make it move left
  pipe.body.velocity.x = -200;

  // automatically kill the pipe when it's no longer visible
  pipe.checkWorldBounds = true;
  pipe.outOfBoundsKill = false;
  },

  addRowOfPipes: function() {
    // randomly pick a number between 1 and 5 for hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // add the 6 pipes
    // with one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 5; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);

        // increase score by 1 each time new pipes are created
        this.score += 1;
        this.labelScore.text = this.score;
  },

  hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
},

};

// initialize phaser and create a 400px by 490px game // 288 x 505
var game = new Phaser.Game(335, 490);

// add the 'mainState' and call it 'main'
game.state.add('main', mainState)

// start the state to actually start the game
game.state.start('main');
