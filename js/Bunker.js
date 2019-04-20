class Bunker extends Tower{
    description = 'Structure used to lightly damage multiple monsters.';
    
    constructor(location) {
        super(location, 20);
        this.cost = 15;
        this.damage = 1;
        this.max_targets = 4;
        this.range = 2;
    }
}