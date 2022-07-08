kaboom({
  fullscreen: true,
  clearColor:[134, 135, 247],
  global: true,
  scale: 1,
});

loadRoot("./sprites/");
loadSprite("bricks_ovw", "bricks.jpg");
loadSprite("bricks_ovw_goomba", "bricks.jpg");
loadSprite("bricks_ovw2", "block.png");
loadSprite("mario", "mario.png");
loadSprite("jumping_mario", "mario but jump.png");
loadSprite("peach", "princes.png");
loadSprite("world1", "mario 1-1.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed_qmb", "unboxed_qmb.png");
loadSprite("qmb", "question_mark_block.png");
loadSprite('mushroom_qmb', 'question_mark_block.png')
loadSprite('mushroom', 'mushroom.png')
loadSprite('goomba', 'evil_mushroom.png')
loadSprite('pipe', 'pipe_up.png')
loadSound("jump", "jumpSound.mp3");


scene("lose", () => {
  add([
    text("game over", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  add([
    text("space to restart", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);

scene("win",() => {
  add([
    text("Thanks for playing my demo!", 128),
    origin("center"),
    pos(width() / 2, height() / 2 + 200)
  ])
})
scene("level2",() => {

})

  keyDown("space", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");


let seconds= 0
let score = 0;
let scorelabel = add([text("score: " + score)]);


  const map = [
    "                                                                                        ",
    "                                                                                        ",
    "                                                                                        ",
    "                                                                                        ",
    "                                                           =        ==                  ",
    "                                                      ==                                ",
    "                                                 =               =                      ",
    "            *?*/*                  =                                                    ",
    "                                   =             ??                                     ",
    "}  m                               =                                                    ",
    "======  }==================}========}===============}==  ===                  _         ",
    "======  ===============================================  ===                 ===        ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("bricks_ovw"), solid(), "bricks_ovw"],
    "}": [sprite("bricks_ovw_goomba"), solid(), "bricks_ovw_goomba"],
    "*": [sprite("bricks_ovw2"), solid(), "bricks_ovw2"],
    "p": [sprite("peach")],
    "?": [sprite("qmb"), solid(), 'qmb'],
    "/": [sprite("mushroom_qmb"), solid(), 'mushroom_qmb'],
    "m2": [sprite("mushroom"), solid(), body(), 'mushroom'],
    "-": [sprite("unboxed_qmb"), solid()],
    "$": [sprite("coin"), 'coins'],
    "_":[sprite("pipe"), solid(), "pipe"]
  };

  let player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
    "player",
  ]);

  let goomba = add([
    sprite("goomba"),
    solid(),
    pos(70, -10),
    body(),
    origin("bot"),
    "goomba",
  ])
  const gameLevel = addLevel(map, mapSymbols);

  let moveSpeed = 110;
  keyDown("d", () => {
    player.move(moveSpeed, 0);
    if (moveSpeed <= 170) {
      moveSpeed = moveSpeed + 1;
      if (moveSpeed % 10 == 0) {
        console.log(moveSpeed);
      }
    }
    keyRelease("d", () => {
      if (moveSpeed > 90) {
        moveSpeed = 90;
      }
    });
  });
  keyDown("a", () => {
    player.move(-moveSpeed, 0);
    if (moveSpeed <= 170) {
      moveSpeed = moveSpeed + 1;

      if (moveSpeed % 10 == 0) {
        console.log(moveSpeed);
      }
    }
  });

  keyRelease("a", () => {
    if (moveSpeed > 90) {
      moveSpeed = 90;
    }
  });

  keyDown("w", () => {
    if (player.grounded()) {
      player.jump(400);
      play("jump");
    }
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(400);
      play("jump");
    }
  });
  let player_grounded = player.grounded
  player_pos = player.pos

  player.action(() => {
    if (player_grounded) {
    }
    else {

    }
  })

  let coinbox = 0
  player.on("headbump", (obj) => {
    if (obj.is("qmb")) {
      if(coinbox < 5){

      gameLevel.spawn("$", obj.gridPos.sub(0 + coinbox, 1));
      coinbox++
    }
    else{
      destroy(obj)
      gameLevel.spawn("-", obj.gridPos.sub(0, 0));
      coinbox = 0
    }
  }
    if (obj.is("mushroom_qmb")) {
      destroy(obj);
      gameLevel.spawn("-", obj.gridPos.sub(0, 0));
      gameLevel.spawn("m2", obj.gridPos.sub(0, 1));
    }

  });
  let mario_big = 0
  action('mushroom', (obj) => {
    obj.move(50, 0)
  })
  player.collides('coins', (obj) => {
    destroy(obj)
    score++
  })
  player.collides('mushroom', (obj) => {
    destroy(obj)
    player.biggify()
    score+= 10
    mario_big = 1
  })

  player.action(() => {
    camPos(player.pos)
    scorelabel.pos = player.pos.sub(400, 180);
    scorelabel.text = "score: " + score;
    console.log(player.pos.y);
    if (player.pos.y >= 260) {
      go("lose");
    }
  })

  let goomba_ms = 300;
  goomba.action(() => {
    goomba.move(goomba_ms, 0)
  })
  goomba.collides('bricks_ovw_goomba', (obj) => {

    goomba_ms = -goomba_ms

  })
  goomba.collides('player', (obj) => {
    player.smallify()
    if(mario_big == 1) {
    mario_big = 0
  }
  setInterval(() => {
    seconds++;
  }, 1000);
  if(mario_big == 0 && seconds >= 5) {
   
    go("lose")
  }
  if (player.grounded() == false) {
      destroy(goomba);
    }
  player.collides('pipe', () => {
    go('level2')
  })
  })

});

start("game");
//aziz was here