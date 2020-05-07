class ElectricFence extends Structure {
    description = 'Structure used to impede monster movement and damage attacking monsters.';
    label = '[E]';
    bg_color = '#F9E79F';

    constructor(location) {
        super(location, 20);
        this.cost = 5;
        this.damage = 1; //when attacked
    }

    takeDamage(damage, source) {
        this.hit_points -= damage;
        this.giveDamage(source);
        if (this.hit_points < 1) {
            //entity is dead, remove from game
            this.remove();
        }
    }
}