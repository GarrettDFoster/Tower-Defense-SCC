class Forest extends Structure {
    description = 'Structure used to impede monster movement.';

    constructor(location) {
        super(location, 25);
        this.cost = 2;
    }
}