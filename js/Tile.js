class Tile {
    location;
    occupant = undefined; //this is the Entity (Structure or Monster) that occupies the tile. Only one Entity may occupy a tile at a time

    constructor(row, column) {
        this.location = [row,column];
    }

    clear() {
        this.occupant = undefined;
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
}