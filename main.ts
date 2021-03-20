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
var client1 = new Client()
var client2 = new Client()

var gamemanager = new GameManager()
var globalEntityStore = gamemanager.entityStore;
var appel = document.querySelector('#app');
gamemanager.setupListeners()
gamemanager.eventQueue.onProcessFinished.listen(() => {
    updateHtml()
})
gamemanager.eventQueue.addAndTrigger('gamestart', null)





function updateHtml(){
    var jsx = renderHomepage()
    ReactDOM.render(jsx, appel)
}



// var players = gamemanager.getPlayers()
// var currentplayer = gamemanager.getCurrentPlayer()
// gamemanager.eventQueue.addAndTrigger('playcard', currentplayer.child(e => true))

// loop((dt) => {
//     ctxt.clearRect(0,0,screensize.x,screensize.y)

//     ctxt.fillRect(10,10,10,10)
// })
