class Server{
    gamemanager: GameManager;
    output = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.output.trigger({type:'update',data:this.serialize()})
        })
    }

    onConnect(client){
        
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }



    serialize(){
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}