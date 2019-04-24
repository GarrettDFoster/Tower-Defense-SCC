//class for things that can be added and removed from game board
class Entity {
    hit_points; //integer indicating how many hit points an entity has until it dies
    damage; //integer indicating how much damage an entity will do to another entity
    location; //2-element array containing row and column identifier
    is_dead; //boolean used to flag entities for removal from gameboard after each partial step
    is_blocking; //boolean used to determine if entity blocks other entities from entering tile
    label = '?';
    bg_color = '#FFFFFF';
    txt_color = '#000000';

    constructor(location, hit_points) {
        this.location = location;
        this.hit_points = hit_points;
        this.damage = 0; //default value
        this.is_dead = false;
        this.is_blocking = true; //default value
    }

    takeDamage(damage) {
        this.hit_points -= damage;
        if (this.hit_points < 1) {
            //entity is dead, remove from game
            this.remove();
        }
    }

    giveDamage(target) {
        if (!this.is_dead) { //check to make sure entity is still alive before passing along damage
            target.takeDamage(this.damage); //calls the takeDamage method of passed in entity
        }
    }

    remove() {
        this.is_dead = true; //flag entity for removal
    }
}