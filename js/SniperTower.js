class SniperTower extends Tower{
    description = 'Structure used to heavily damage a single monster.';
    label = '(S)';
    bg_color = '#E8DAEF';
    
    constructor(location) {
        super(location, 5);
        this.cost = 10;
        this.damage = 5;
        this.max_targets = 1;
        this.range = 3;
    }
}