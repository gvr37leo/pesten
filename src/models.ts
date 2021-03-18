class Rank{
    constructor(public name:string){

    }
}

class House{
    constructor(public name:string, public color:string){

    }
}

var rankMap = {
    two:new Rank('two'),
    three:new Rank('three'),
    four:new Rank('four'),
    five:new Rank('five'),
    six:new Rank('six'),
    seven:new Rank('seven'),
    eight:new Rank('eight'),
    nine:new Rank('nine'),
    ten:new Rank('ten'),
    jack:new Rank('jack'),
    queen:new Rank('queen'),
    king:new Rank('king'),
    ace:new Rank('ace'),
}

var houseMap = {
    spades:new House('spades','black'),
    clubs:new House('clubs','black'),
    diamonds:new House('diamonds','red'),
    hearts:new House('hearts','red'),
}

class Entity{
    id:number = -1
    parent:number = -1
    type:string = ''
    name:string =''
    children = new Set<number>()
    ordercount = 0
    sortorder = 0

    public constructor(init?:Partial<Entity>) {
        Object.assign(this, init);
        this.type = 'entity'
    }

    setChild(child:Entity){
        //remove child from old parent
        var oldparent = globalEntityStore.get(child.parent)
        if(oldparent != null){
            oldparent.children.delete(child.id)
        }
        this.children.add(child.id)
        child.parent = this.id
        child.sortorder = this.ordercount++
    }

    setParent(parent:Entity){
        if(parent == null){
            this.parent = null
        }else{
            parent.setChild(this)
        }
    }

    getParent(){
        return globalEntityStore.get(this.parent)
    }

    descendant(cb:(ent:Entity) => boolean):Entity{
        return this.descendants(cb)[0]

    }

    descendants(cb:(ent:Entity) => boolean):Entity[]{
        var children = this._children(cb)
        var grandchildren = children.flatMap(c => c.descendants(cb))
        return children.concat(grandchildren)
    }
    
    child(cb:(ent:Entity) => boolean):Entity{
        return this._children(cb)[0]
    }

    _children(cb:(ent:Entity) => boolean):Entity[]{
        return Array.from(this.children.values()).map(id => globalEntityStore.get(id)).filter(cb).sort((a,b) => a.sortorder - b.sortorder)
    }


    ancestor(cb:(ent:Entity) => boolean):Entity{
        var current:Entity = this
        while(current != null && cb(current) == false){
            current = globalEntityStore.get(current.parent)
        }
        return current
    }
}




function storeAdd(store:Store<Entity>){
    return function(entity:Entity,parent:Entity){
        store.add(entity)
        entity.setParent(parent)
        return entity
    }
}




class Game extends Entity{
    turnindex:number = 0
    currentHouse:House
    shownPlayer:Player
    bullycounter = 0

    constructor(){
        super()
        this.type = 'game'
    }
}

class Card extends Entity{

    public constructor(init?:Partial<Card>) {
        super()
        Object.assign(this, init);
        this.type = 'card'
    }

    isJoker:boolean = false
    rank:Rank = rankMap.three
    house:House = houseMap.clubs

}

class Player extends Entity{

    public constructor(init?:Partial<Player>) {
        super()
        Object.assign(this, init);
        this.type = 'player'
    }
}