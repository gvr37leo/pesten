class Server{
    gamemanager: GameManager;

    constructor(){
        this.gamemanager = new GameManager()
        var globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            
        })
        // gamemanager.eventQueue.addAndTrigger('gamestart', null)
    }

    onConnect(client){
        
    }

    listenmsg(msgtype,data){

    }

    send(msgtype,data){

    }

    serialize(){
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    deserialize(entities:any[]){
        var store = new Store<Entity>()
        
        for(var entity of entities){
            entity.prototype = Entity
            store.add(entity)
        }

        return store
    }
}