class ServerClient{
    
    output = new EventSystem<any>()

    constructor(public socket, public id){


        this.socket.on('message',(data) => {
            this.output.trigger(data)
        })
    }

    input(type,data){
        this.socket.emit('message',{type,data})
    }
}

class Server{
    gamemanager: GameManager;
    output = new EventSystem<{type:string,data:any}>()
    clients = new Store<ServerClient>()

    onBroadcast = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.addAndTrigger('init',null)

        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.gamemanager.broadcastEvent.trigger({type:'update',data:this.gamemanager.entityStore.list()})
            //set synced status of updated entities to true
        })

        this.gamemanager.broadcastEvent.listen((event) => {
            for(var client of this.clients.list()){
                client.input(event.type,event.data)
            }
        })

        this.gamemanager.sendEvent.listen((event) => {
            this.clients.get(event.clientid).input(event.type,event.data)
        })
    }

    connect(client:ServerClient){
        this.clients.add(client)
        client.input('idreturn',client.id)
        //maybe add player aswell

        client.socket.on('disconnect',() => {
            //if so delete it here
            this.clients.remove(client.id)
        })

        client.output.listen(e => {
            server.input(e.type,{clientid:client.id,data:e.data})
        })
    }

    input(type,data){
        this.gamemanager.eventQueue.addAndTrigger(type,data)
    }

    serialize(){
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list())
    }

    
}