class ElectricFence extends Structure {
    description = 'Structure used to impede monster movement and damage attacking monsters.';

    constructor(location) {
        super(location, 20);
        this.cost = 10;
        this.damage = 1; //when attacked
    }
}