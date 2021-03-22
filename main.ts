/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="libs/utils/camera.ts" />
/// <reference path="src/shared/models.ts" />
/// <reference path="src/server/gamemanager.ts" />
/// <reference path="src/client/tsx/player.tsx" />
/// <reference path="src/client/tsx/card.tsx" />
/// <reference path="src/client/tsx/homepage.tsx" />
/// <reference path="src/client/tsx/modal.tsx" />
/// <reference path="src/client/client.ts" />
/// <reference path="src/server/server.ts" />



//updates to librarys
//discovery in eventqueue
//bugfix in eventsystem
var server = new Server()

var clients = [new Client(),new Client()]
var currentclientI = 0


clients[0].output.listen(e => {
    server.input(e.type,e.data)
})

clients[1].output.listen(e => {
    server.input(e.type,e.data)
})


var appel = document.querySelector('#app');
server.input('init',{})
server.input('playerjoin',{name:'amy'})
server.input('playerjoin',{name:'bob'})
server.input('playerjoin',{name:'carl'})
server.input('playerjoin',{name:'dante'})

server.connect(clients[0])
server.connect(clients[1])

// server.output.listen((e) => {
//     clients[0].input(e.type,e.data)
//     clients[1].input(e.type,e.data)
//     renderHTML()
// })

server.input('gamestart',{})




function renderHTML(){
    ReactDOM.render(clients[currentclientI].root, appel)
}

document.addEventListener('keydown',e => {
    if(e.key =='q'){
        currentclientI = (currentclientI + 1) % clients.length
        renderHTML()
    }
})

//todo
//sync up entities client/server
//send messages between them
//update discovery to work with messages instead of cb


// var players = gamemanager.getPlayers()
// var currentplayer = gamemanager.getCurrentPlayer()
// gamemanager.eventQueue.addAndTrigger('playcard', currentplayer.child(e => true))

// loop((dt) => {
//     ctxt.clearRect(0,0,screensize.x,screensize.y)

//     ctxt.fillRect(10,10,10,10)
// })
