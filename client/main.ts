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
/// <reference path="client.ts" />
/// <reference path="tsx/card.tsx" />
/// <reference path="tsx/homepage.tsx" />
/// <reference path="tsx/modal.tsx" />
/// <reference path="tsx/player.tsx" />
/// <reference path="../shared/models.ts" />







const socket = io();
socket.emit('hello',{data:'test'})
socket.on('message',(data) => {
    console.log(data)
})


//updates to librarys
//discovery in eventqueue
//bugfix in eventsystem
// var server = new Server()

// var clients = [new Client(),new Client()]
// var currentclientI = 0


// var appel = document.querySelector('#app');
// server.input('init',{})

// server.connect(clients[0])
// server.connect(clients[1])

// server.input('playerjoin',{name:'amy',clientid:clients[0].id})
// server.input('playerjoin',{name:'bob',clientid:clients[1].id})
// server.input('playerjoin',{name:'carl',clientid:clients[1].id})
// server.input('playerjoin',{name:'dante',clientid:clients[1].id})

// server.input('gamestart',{})




// function renderHTML(){
//     ReactDOM.render(clients[currentclientI].root, appel)
// }

// document.addEventListener('keydown',e => {
//     if(e.key =='q'){
//         currentclientI = (currentclientI + 1) % clients.length
//         renderHTML()
//     }
// })


