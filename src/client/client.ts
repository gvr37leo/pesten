class Client{

    root:JSX.Element
    output = new EventSystem<{type,data}>()
    entityStore:Store<Entity>
    helper: Helper
    clientid = 0
    shownPlayerid = 0


    constructor(){

    }

    input(type,data){
        if(type == 'update'){
            this.entityStore = this.deserialize(data)
            this.helper = new Helper(this.entityStore)
            this.updateHtml()
            renderHTML()
        }
    }

    connect(server:Server){
        server.onConnect(this)
    }

    updateHtml(){
        this.root = renderHomepage(this)
    }

    deserialize(data:string){
        var entities = JSON.parse(data)
        var store = new Store<Entity>()
        
        for(var entity of entities){
            entity.__proto__ = Entity.prototype
            store.insert(entity)
        }

        return store
    }
}