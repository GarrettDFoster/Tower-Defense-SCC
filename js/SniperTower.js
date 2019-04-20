class SniperTower extends Tower{
    description = 'Structure used to heavily damage a single monster.';
    
    constructor(location) {
        super(location, 5);
        this.cost = 20;
        this.damage = 5;
        this.max_targets = 1;
        this.range = 3;
    }
}