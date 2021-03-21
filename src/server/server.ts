class Server{

    constructor(){
        var gamemanager = new GameManager()
        var globalEntityStore = gamemanager.entityStore;

        gamemanager.setupListeners()
        gamemanager.eventQueue.onProcessFinished.listen(() => {
            updateHtml()
        })
        // gamemanager.eventQueue.addAndTrigger('gamestart', null)
    }

    onConnect(client){
        
    }

    listenmsg(msgtype,data){

    }

    send(msgtype,data){

    }
}