class Structure extends Entity{
    cost;

    constructor(location, hit_points) {
        super(location, hit_points);
        this.cost = 0; //default cost
    }
}