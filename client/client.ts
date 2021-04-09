class Client{

    root:JSX.Element
    output = new EventSystem<{type,data}>()
    entityStore:Store<Entity>
    helper: Helper
    id = null
    sessionid = null
    lastprocessedversion = null

    // <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js"></script>
    socket: any//socket.io socket


    constructor(){

    }

    connectSocket(socket){
        this.socket = socket

        client.output.listen((val) => {
            socket.emit('message',val)
        })
        socket.on('message',(message) => {
            client.input(message.type,message.data)
        })

        socket.on('connect',() => {
            console.log('connected')
            socket.emit('handshake',{sessionid:parseInt(sessionStorage.getItem('sessionid'))},({ sessionid, clientid }) => {
                sessionStorage.setItem('sessionid',sessionid)
                this.sessionid = sessionid
                this.id = clientid
            })
        })

        socket.on('disconnect',() => {
            console.log('disconnected');
        })

        socket.open()

    }

    input(type,data){
        if(type == 'deltaupdate'){
            //check version number
            console.log('delta update')
            this.entityStore.applyChanges(data.deletions,data.upserts)
            if(to(this.lastprocessedversion,data.version) >= 2){
                this.output.trigger({type:'requestfullupdate',data:{}})
                console.log(`request full update ${this.lastprocessedversion} -> ${data.version}`)
            }
            this.lastprocessedversion = data.version
            this.updateHtml()
        }

        if(type == 'update'){
            
            console.log('full update')
            this.lastprocessedversion = data.version
            this.entityStore = this.deserialize(data.data)
            Entity.globalEntityStore = this.entityStore
            this.helper = new Helper(this.entityStore)
            this.updateHtml()
        }

        if(type == 'turnstart'){
            var selfplayer = this.helper.getClientPlayer(this.id)
            if(selfplayer.id == data){
                navigator.vibrate(500)
                toastr.success('your turn')
            }
        }

        if(type == 'error'){
            toastr.error(data)
        }
       
    }

    updateHtml(){
        this.root = MainApp({client:this})
        renderHTML()
    }

    deserialize(data:any[]){
        var entities = data
        var store = new Store<Entity>()
        
        for(var entity of entities){
            entity.__proto__ = Entity.prototype
            store.insert(entity)
        }

        return store
    }
}