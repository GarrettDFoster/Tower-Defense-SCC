class Tile {
    location;
    occupant = undefined; //this is the Entity (Structure or Monster) that occupies the tile
    trap = undefined; //this is a hack to keep the traps from dissapearing

    constructor(row, column) {
        this.location = [row,column];
    }

    get is_empty() {
        if (typeof (this.occupant) == 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    get is_blocked() {
        if (!this.is_empty && this.occupant.is_blocking) {
            return true;
        } else {
            return false;
        }
    }

    clear() {
        this.occupant = undefined;
        this.trap = undefined;
    }

    add(entity){
        this.occupant = entity;
        if(entity instanceof Trap){
            this.trap = entity;
        }
    }
}