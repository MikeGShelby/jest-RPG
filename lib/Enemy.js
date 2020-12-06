const Potion = require('./Potion');
const Character = require('./Character');

class Enemy extends Character {
    constructor(name, weapon) {
        // call parent constructor here:
        super(name);

        this.weapon = weapon;
        this.potion = new Potion();
    }

    getDescription() {
        return `A ${this.name} holding a ${this.weapon} has appeared!`;
    };

}


// inherit prototype methods from Character here:
// Enemy.prototype = Object.create(Character.prototype);

module.exports = Enemy;