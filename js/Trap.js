class Trap extends Structure{
    delay;
    
    constructor(location, hit_points) {
        super(location, hit_points);
        this.delay = 0; //default delay
        this.is_blocking = false; //traps do not block movement by design
    }
}