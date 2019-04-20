class Tile {
    entity; //this is the Entity (Structure or Monster) that occupies the tile. Only one entity may occupy a tile at a time

    constructor(){

    }

    clear(){
        this.entity = undefined;
    }

    get is_empty(){
        if(typeof(this.entity) == 'undefined'){
            return true;
        }else{
            return false;
        }
    }

    get is_blocked(){
        if(!this.is_empty && this.entity.is_blocking){
            return true;
        }else{
            return false;
        }
    }
}