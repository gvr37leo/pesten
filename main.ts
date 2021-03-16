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

//updates to librarys
//discovery in eventqueue
//bugfix in eventsystem



var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt

var gamemanager = new GameManager()
var globalEntityStore = gamemanager.entityStore;
gamemanager.setupListeners()
gamemanager.eventQueue.addAndTrigger('gamestart', null)

var players = gamemanager.getPlayers()
var currentplayer = gamemanager.getCurrentPlayer()
gamemanager.eventQueue.addAndTrigger('playcard', currentplayer.child(e => true))

// loop((dt) => {
//     ctxt.clearRect(0,0,screensize.x,screensize.y)

//     ctxt.fillRect(10,10,10,10)
// })
