class Tower extends Structure{
    range;
    max_targets;

    constructor(location, hit_points) {
        super(location, hit_points);
        this.range = 0; //default range
        this.max_targets = 0; //default max targets
    }
}