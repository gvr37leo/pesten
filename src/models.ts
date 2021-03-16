enum Rank{two,three,four,five,six,seven,eight,nine,ten,jack,queen,king,ace}
enum House{spades,clubs,diamonds,hearts}

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
        oldparent.children.delete(child.id)
        this.children.add(child.id)
        child.parent = this.id
        child.sortorder = this.ordercount++
    }

    setParent(parent:Entity){
        parent.setChild(this)
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
    rank:Rank = Rank.ace
    house:House = House.clubs

}

class Player extends Entity{

    public constructor(init?:Partial<Player>) {
        super()
        Object.assign(this, init);
        this.type = 'player'
    }
}