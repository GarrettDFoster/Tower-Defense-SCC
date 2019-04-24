class Monster extends Entity {
    delay;
    label = 'M';
    bg_color = '#F2D7D5';
    
    constructor(location,turn){
        super(location,turn); //TODO need to check if monster already exists on spawn point
        this.delay = 0;
        this.damage = 1; //overwrite default value
    }
}