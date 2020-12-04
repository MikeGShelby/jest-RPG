const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');


function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
  }


Game.prototype.initializeGame = function() {
    // push three enemies to the enemies array
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    // when game starts, player will fight the first enemey in the array
    this.currentEnemy = this.enemies[0];

    // Prompt the user to provide their name
    inquirer
    .prompt({
      type: 'text',
      name: 'name',
      message: 'What is your name?'
    })
    // destructure name from the prompt object
    .then(({ name }) => {
      this.player = new Player(name);

      // test the object creation
      console.log(this.currentEnemy, this.player);
    });
};

module.exports = Game;