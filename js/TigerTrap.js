class TigerTrap extends Trap {
    description = 'Structure used to damage and slow a single monster.';
    label = 'T';
    bg_color = '#F8C471';

    constructor(location) {
        super(location, 10);
        this.cost = 5;
        this.delay = 1;
        this.damage = 1; //on entry
    }
}