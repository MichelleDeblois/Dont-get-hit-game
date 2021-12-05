// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    this.points = 0;
    this.level = 1;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });
    this.enemies.forEach((enemy) => {
      if (enemy.destroyed) {
        this.points += 1;
        if (this.points % 5 === 0) {
          this.level += 1;
          console.log({ level: this.level });
        }
      }
    });
    const b = document.querySelector("#points-board");
    b.innerText = `Points: ${this.points}`;

    const levelText = document.getElementById("level");
    levelText.innerHTML = `Level: ${this.level}`;

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)

    if (this.isPlayerDead()) {
      console.log(this.root);
      const gameOver = document.createElement("div");
      const restartButton = document.createElement("button");
      restartButton.innerText = "RESTART";
      restartButton.style.zIndex = "200";
      restartButton.style.position = "absolute";
      restartButton.style.padding = "20px";
      restartButton.style.fontSize = "50px";
      restartButton.style.backgroundColor = "Transparent";
      restartButton.style.borderColor = "red";
      restartButton.style.fontFamily = "Minecrafter";
      restartButton.style.color = "white";
      gameOver.classList.add("gameOver");
      gameOver.innerText = "GAME OVER";
      gameOver.style.position = "absolute";
      gameOver.style.color = "red";
      gameOver.style.zIndex = "200";
      gameOver.style.fontSize = "100px";
      this.root.append(gameOver);
      const xPos = window.innerWidth / 2 - gameOver.offsetWidth / 2;
      const yPos = window.innerHeight / 2 - gameOver.offsetHeight / 2;
      gameOver.style.top = `${yPos}`;
      gameOver.style.left = `${xPos}`;
      // window.alert("Game over");
      this.root.append(restartButton);
      restartButton.style.top = `${yPos + 80}px`;
      restartButton.style.left = `${xPos + 200}px`;
      restartButton.addEventListener("click", () => {
        location.reload();
      });
      return;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.

  isPlayerDead = () => {
    for (let i = 0; i < this.enemies.length; i++) {
      if (
        this.enemies[i].x === this.player.x &&
        this.enemies[i].y >= GAME_HEIGHT - ENEMY_HEIGHT - PLAYER_HEIGHT
      ) {
        return true;
      }
    }
  };
}
console.log(this.player);
console.log(this.enemies);
