class Client{

    root:JSX.Element
    output = new EventSystem<{type,data}>()
    entityStore:Store<Entity>
    helper: Helper
    id = null


    constructor(){

    }

    input(type,data){
        if(type == 'update'){
            this.entityStore = this.deserialize(data)
            Entity.globalEntityStore = this.entityStore
            this.helper = new Helper(this.entityStore)
            this.updateHtml()
        }

        if(type == 'idreturn'){
            this.id = data
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