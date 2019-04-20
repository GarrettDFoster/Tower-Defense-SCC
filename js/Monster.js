class Monster extends Entity {
    delay;
    
    constructor(location,turn){
        super(location,turn); //TODO need to check if monster already exists on spawn point
        this.delay = 0;
        this.damage = 1; //overwrite default value
    }

    move(){
        if(this.delay > 0){
            this.delay -= 1;
        }else{
            
        }
    }

}