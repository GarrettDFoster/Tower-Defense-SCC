class WaterTrap extends Trap {
    description = 'Structure used to slow a single monster.';
    label = 'W';
    bg_color = '#D6EAF8';

    constructor(location) {
        super(location, 100);
        this.cost = 2;
        this.delay = 1;
    }
}