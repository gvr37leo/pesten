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
/// <reference path="src/models.ts" />
/// <reference path="src/gamemanager.ts" />
/// <reference path="src/tsx/player.tsx" />
/// <reference path="src/tsx/card.tsx" />
/// <reference path="src/tsx/homepage.tsx" />
/// <reference path="src/tsx/modal.tsx" />


//updates to librarys
//discovery in eventqueue
//bugfix in eventsystem


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
