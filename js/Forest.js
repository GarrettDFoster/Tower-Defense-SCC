class Forest extends Structure {
    description = 'Structure used to impede monster movement.';
    label = '[F]';
    bg_color = '#D4EFDF';  

    constructor(location) {
        super(location, 25);
        this.cost = 2;
    }
}