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
/// <reference path="client.ts" />
/// <reference path="tsx/card.tsx" />
/// <reference path="tsx/homepage.tsx" />
/// <reference path="tsx/modal.tsx" />
/// <reference path="tsx/player.tsx" />
/// <reference path="shared/models.ts" />
/// <reference path="shared/helper.ts" />
/// <reference path="tsx/startscreen.tsx" />
/// <reference path="tsx/mainapp.tsx" />
/// <reference path="tsx/gamewonscreen.tsx" />





//todo

//sessions
//make it so you can see more cards in hand
// heroku



const socket = io();
var userID = null


var client = new Client()
client.output.listen((val) => {
    socket.emit('message',val)
})
socket.on('message',(message) => {
    client.input(message.type,message.data)
})


socket.on('sessionID',({ sessionID, userID }) => {
    console.log(`sessionID:${sessionID}`)
    userID = userID
    localStorage.setItem('sessionID',sessionID)
})

var appel = document.querySelector('#app');
function renderHTML(){
    ReactDOM.render(client.root, appel)
}


//updates to librarys
//discovery in eventqueue
//bugfix in eventsystem
// var server = new Server()

// var clients = [new Client(),new Client()]
// var currentclientI = 0



// server.input('init',{})

// server.connect(clients[0])
// server.connect(clients[1])

// server.input('playerjoin',{name:'amy',clientid:clients[0].id})
// server.input('playerjoin',{name:'bob',clientid:clients[1].id})
// server.input('playerjoin',{name:'carl',clientid:clients[1].id})
// server.input('playerjoin',{name:'dante',clientid:clients[1].id})

// server.input('gamestart',{})






// document.addEventListener('keydown',e => {
//     if(e.key =='q'){
//         currentclientI = (currentclientI + 1) % clients.length
//         renderHTML()
//     }
// })


