class Rank{
    constructor(public name:string,public abbr:string){

    }
}

class House{
    constructor(public name:string, public color:string,public abbr:string){

    }
}

var rankMap = {
    two:new Rank('two','2'),
    three:new Rank('three','3'),
    four:new Rank('four','4'),
    five:new Rank('five','5'),
    six:new Rank('six','6'),
    seven:new Rank('seven','7'),
    eight:new Rank('eight','8'),
    nine:new Rank('nine','9'),
    ten:new Rank('ten','10'),
    jack:new Rank('jack','J'),
    queen:new Rank('queen','Q'),
    king:new Rank('king','K'),
    ace:new Rank('ace','A'),
}

var houseMap = {
    spades:new House('spades','black','S'),
    clubs:new House('clubs','black','C'),
    diamonds:new House('diamonds','red','D'),
    hearts:new House('hearts','red','H'),
}

class Entity{
    static globalEntityStore:Store<Entity>

    id:number = -1
    parent:number = -1
    type:string = ''
    name:string =''
    children:number[] = []
    ordercount = 0
    sortorder = 0

    public constructor(init?:Partial<Entity>) {
        Object.assign(this, init);
        this.type = 'entity'
    }

    setChild(child:Entity){
        //remove child from old parent
        var oldparent = Entity.globalEntityStore.get(child.parent)
        if(oldparent != null){
            remove(oldparent.children,child.id)
        }
        this.children.push(child.id)
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
        return Entity.globalEntityStore.get(this.parent)
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
        return this.children.map(id => Entity.globalEntityStore.get(id)).filter(cb).sort((a,b) => a.sortorder - b.sortorder)
    }


    ancestor(cb:(ent:Entity) => boolean):Entity{
        var current:Entity = this
        while(current != null && cb(current) == false){
            current = Entity.globalEntityStore.get(current.parent)
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
    shownPlayerid:number
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
    url:string

}

class Player extends Entity{

    public constructor(init?:Partial<Player>) {
        super()
        Object.assign(this, init);
        this.type = 'player'
    }

    isDiscoveringHouse:boolean
    houseOptions:House[] = []
    discoverCb
}