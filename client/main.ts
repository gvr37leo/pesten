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

//heroku build
//bug with hanging cards in discardpile something with drawing from empty deck
//add game to hobbysite

//add features/updates to libs
//eventqueue updates
//entity system
//networking/sessionid system


const socket = io({
    reconnection:false,
    autoConnect: false,
});


var client = new Client()

client.connectSocket(socket)




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










// document.addEventListener('keydown',e => {
//     if(e.key =='q'){
//         currentclientI = (currentclientI + 1) % clients.length
//         renderHTML()
//     }
// })


