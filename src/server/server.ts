class Server{
    gamemanager: GameManager;
    // output = new EventSystem<{type:string,data:any}>()
    clients:Client[] = []

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.gamemanager.broadcastEvent.trigger({type:'update',data:this.serialize()})
            //set synced status of updated entities to true
        })

        this.gamemanager.broadcastEvent.listen((event) => {
            for(var client of this.clients){
                client.input(event.type,event.data)
            }
        })

        this.gamemanager.sendEvent.listen((event) => {
            this.clients.find(c => c.clientid == event.clientid).input(event.type,event.data)
        })
    }

    connect(client:Client){
        this.clients.push(client)
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }

    serialize(){
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}