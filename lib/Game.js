const { get } = require('http');
const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

class Game {
    constructor() {
      this.roundNumber = 0;
      this.isPlayerTurn = false;
      this.enemies = [];
      this.currentEnemy;
      this.player;
    }

  // increase enemy stats for rounds 3-6
  roundIncrease() {
    if (this.roundNumber >2 && this.roundNumber <6) {
        this.currentEnemy.health += Math.floor(this.currentEnemy.health*0.75);
        this.currentEnemy.strength += Math.floor(this.currentEnemy.strength*0.75);
        this.currentEnemy.agility += Math.floor(this.currentEnemy.agility*0.35);

        this.currentEnemy.potion.value += Math.floor(this.currentEnemy.potion.value*0.35);
        this.currentEnemy.potion.name = ("greater " + this.currentEnemy.potion.name);
    }

    else if (this.roundNumber > 5) {
        this.currentEnemy.health += Math.floor(this.currentEnemy.health*1.25);
        this.currentEnemy.strength += Math.floor(this.currentEnemy.strength*1.25);
        this.currentEnemy.agility += Math.floor(this.currentEnemy.agility*1);
    }
  }

  getBattleStats() {
    const playerName = this.player.name;
    const enemyName = this.currentEnemy.name;

    return {
      [playerName]: this.player.health,
      [enemyName]: this.currentEnemy.health
    };
  }

  initializeGame() {
      // push all enemies to the enemies array
      this.enemies.push(new Enemy('goblin', 'sword'));
      this.enemies.push(new Enemy('orc', 'club'));
      this.enemies.push(new Enemy('skeleton', 'axe'));

      this.enemies.push(new Enemy('gnoll', 'spear'));
      this.enemies.push(new Enemy('giant', 'sword'));
      this.enemies.push(new Enemy('dragon', 'dragon claws'));

      this.enemies.push(new Enemy('Dark Mage (FINAL BOSS!!)', 'Dark Staff'));

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

        this.startNewBattle();
      });
  };

 startNewBattle() {
    this.roundIncrease();

    if (this.player.agility > this.currentEnemy.agility) {
      this.isPlayerTurn = true;
    } else {
      this.isPlayerTurn = false;
    }

    console.log(' ');
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());

    console.log(this.currentEnemy.getDescription());

    this.battle();
  };

  battle() {
      console.table(this.getBattleStats());

      if (this.isPlayerTurn) {
          inquirer
          .prompt({
              type: 'list',
              message: 'What would you like to do?',
              name: 'action',
              choices: ['Attack', 'Use potion']
          })
          .then(({ action }) => {
              if (action === 'Use potion') {
                  if (!this.player.getInventory()) {
                    console.log("You don't have any potions!");

                    // after player sees their empty inventory...
                    return this.checkEndOfBattle();
                  }

                  inquirer
                  .prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                  })
                  .then(({ action }) => {
                      const potionDetails = action.split(': ');

                      this.player.usePotion(potionDetails[0] - 1);
                      console.log(`You used a ${potionDetails[1]} potion. Here are your current stats`);
                      console.table(this.player.getStats());

                      // after player uses a potion...
                      this.checkEndOfBattle();
                  });
                }

              else {
                  // get enemy defense value
                  const defense = this.currentEnemy.getDefenseValue();

                  // get player damage value
                  const damage = this.player.getAttackValue();

                  // get player damage minus enemy's defense
                  const netDamage = Math.floor(damage-defense);

                  // player deals damage, minus enemy's defense
                  netDamage < 0 ? netDamage === 0 && this.currentEnemy.reduceHealth(0) : this.currentEnemy.reduceHealth(netDamage);

                  console.log(`You attacked the ${this.currentEnemy.name} for ${netDamage}`);
                  console.log(this.currentEnemy.getHealth());

                  // after player attacks...
                  this.checkEndOfBattle();
              }
          });
      }

      else {
        // get player defense value
        const defense = this.player.getDefenseValue();

        // get enemy damage value
        const damage = this.currentEnemy.getAttackValue();

        // get enemy damage minus player's defense
        const netDamage = Math.floor(damage-defense);

        // enemy deals damage, minus player's defense
        netDamage < 0 ? netDamage === 0 && this.player.reduceHealth(0) : this.player.reduceHealth(netDamage);

        console.log(`You were attacked by the ${this.currentEnemy.name} for ${netDamage}`);
        console.log(this.player.getHealth());

          // after enemy attacks...
          this.checkEndOfBattle();
      }

  };

  checkEndOfBattle() {
      if (this.player.isAlive() && this.currentEnemy.isAlive()) {
          this.isPlayerTurn = !this.isPlayerTurn;
          this.battle();
        }

      else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
          console.log(`You've defeated the ${this.currentEnemy.name}`);

          this.player.addPotion(this.currentEnemy.potion);
          console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

          this.roundNumber++;

          if (this.roundNumber < this.enemies.length) {
          this.currentEnemy = this.enemies[this.roundNumber];
          this.startNewBattle();
          }
          else {
          console.log('You win!');
          }
      }

      else {
          console.log("You've been defeated!");
        }

  };

}


module.exports = Game;