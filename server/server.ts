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
    sessionidcounter = 0

    onBroadcast = new EventSystem<{type:string,data:any}>()

    constructor(){
        this.gamemanager = new GameManager()
        Entity.globalEntityStore = this.gamemanager.entityStore;

        this.gamemanager.setupListeners()
        this.gamemanager.eventQueue.addAndTrigger('init',null)

        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.updateClients()
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

        setInterval(() => {
            var longdcedplayers = this.gamemanager.helper.getPlayers().filter(p => p.disconnected == true && (Date.now() - p.dctimestamp) > 500000_000 )
            longdcedplayers.forEach(p => p.remove())
        },5000)
    }

    updateClients(){
        this.gamemanager.broadcastEvent.trigger({type:'update',data:this.gamemanager.entityStore.list()})
    }

    connect(client:ServerClient){
        this.clients.add(client)
        let players = this.gamemanager.helper.getPlayers()

        //client does a handshake
        //if client sends sessionID look for a player with that sessionid
        //if not found or client sends no sessionid create a new player with a new sessionid
        //finish handshake by sending client and sessionid
        //when a client disconnects flag player as dc'ed and set dc timestamp after 2 min delete dc'ed players

        //client should connect, check for sessionid in localstore/sessionstorage
        //then initiate handshake send found sessionid
        //save session and client id on client and look in database for player with sessionid = client.sessionid
        client.socket.on('handshake',(data,fn) => {
            
            let sessionid = data.sessionid
            if(sessionid == null){
               sessionid = this.sessionidcounter++
            }

            let foundplayer = players.find(p => p.sessionid == sessionid)
            if(foundplayer == null){
                let player = new Player({clientid:client.id,sessionid:sessionid})
                player.inject(this.gamemanager.helper.getPlayersNode())
                
            }else{
                foundplayer.clientid = client.id
                //reconnection dont create new player but do change the pointer to the new client
            }

            fn({
                clientid:client.id,
                sessionid:sessionid,
            })
            this.updateClients()
        })

        
        

        client.socket.on('disconnect',() => {
            var clientplayer = this.gamemanager.helper.getClientPlayer(client.id)

            clientplayer.disconnected = true
            clientplayer.dctimestamp = Date.now()
            this.clients.remove(client.id)
            this.updateClients()
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