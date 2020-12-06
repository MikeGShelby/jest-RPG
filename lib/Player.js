const Potion = require('../lib/Potion');
const Character = require('../lib/Character');
const { tsImportEqualsDeclaration } = require('@babel/types');

class Player extends Character {
  constructor(name = '') {
      // call parent constructor here:
      super(name);

      this.inventory = [new Potion('health'), new Potion()];
  }

  getStats() {
    return {
      potions: `${this.inventory.length} (${this.listPotionNames()})`,
      health: this.health,
      strength: this.strength,
      agility: this.agility
    };
  }

  getInventory() {
    if (this.inventory.length) {
      return this.inventory;
    }
    return false;
  }

  listPotionNames() {
    if (this.inventory.length) {
      return this.getInventory().map((item) => `${item.name}`);
    }
    else if (!this.inventory.length) {
      return ` `;
    }
  }

  addPotion(potion) {
    this.inventory.push(potion);
  }

  usePotion(index) {
    const potion = this.inventory.splice(index, 1)[0];

    switch (potion.name) {
      case 'agility':
        this.agility += potion.value;
        break;
      case 'greater agility':
        this.agility += potion.value;
        break;
      case 'health':
        this.health += potion.value;
        break;
      case 'greater health':
        this.health += potion.value;
        break;
      case 'strength':
        this.strength += potion.value;
        break;
      case 'greater strength':
        this.strength += potion.value;
        break;
    }
  }
}


module.exports = Player;