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
client1.connect(server)
client2.connect(server)
var currentclient = client1

var appel = document.querySelector('#app');

ReactDOM.render(currentclient.root, appel)


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
