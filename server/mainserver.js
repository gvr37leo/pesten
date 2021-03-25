class Vector {
    constructor(...vals) {
        this.vals = vals;
    }
    map(callback) {
        for (var i = 0; i < this.vals.length; i++) {
            callback(this.vals, i);
        }
        return this;
    }
    mul(v) {
        return this.map((arr, i) => arr[i] *= v.vals[i]);
    }
    div(v) {
        return this.map((arr, i) => arr[i] /= v.vals[i]);
    }
    floor() {
        return this.map((arr, i) => arr[i] = Math.floor(arr[i]));
    }
    ceil() {
        return this.map((arr, i) => arr[i] = Math.ceil(arr[i]));
    }
    round() {
        return this.map((arr, i) => arr[i] = Math.round(arr[i]));
    }
    add(v) {
        return this.map((arr, i) => arr[i] += v.vals[i]);
    }
    sub(v) {
        return this.map((arr, i) => arr[i] -= v.vals[i]);
    }
    scale(s) {
        return this.map((arr, i) => arr[i] *= s);
    }
    length() {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * arr[i]);
        return Math.pow(sum, 0.5);
    }
    normalize() {
        return this.scale(1 / this.length());
    }
    to(v) {
        return v.c().sub(this);
    }
    lerp(v, weight) {
        return this.c().add(this.to(v).scale(weight));
    }
    c() {
        return Vector.fromArray(this.vals.slice());
    }
    overwrite(v) {
        return this.map((arr, i) => arr[i] = v.vals[i]);
    }
    dot(v) {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * v.vals[i]);
        return sum;
    }
    loop(callback) {
        var counter = this.c();
        counter.vals.fill(0);
        while (counter.compare(this) == -1) {
            callback(counter);
            if (counter.incr(this)) {
                break;
            }
        }
    }
    compare(v) {
        for (var i = this.vals.length - 1; i >= 0; i--) {
            if (this.vals[i] < v.vals[i]) {
                continue;
            }
            else if (this.vals[i] == v.vals[i]) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return -1;
    }
    incr(comparedTo) {
        for (var i = 0; i < this.vals.length; i++) {
            if ((this.vals[i] + 1) < comparedTo.vals[i]) {
                this.vals[i]++;
                return false;
            }
            else {
                this.vals[i] = 0;
            }
        }
        return true;
    }
    project(v) {
        return v.c().scale(this.dot(v) / v.dot(v));
    }
    get(i) {
        return this.vals[i];
    }
    set(i, val) {
        this.vals[i] = val;
    }
    get x() {
        return this.vals[0];
    }
    get y() {
        return this.vals[1];
    }
    get z() {
        return this.vals[2];
    }
    set x(val) {
        this.vals[0] = val;
    }
    set y(val) {
        this.vals[1] = val;
    }
    set z(val) {
        this.vals[2] = val;
    }
    draw(ctxt) {
        var width = 10;
        var halfwidth = width / 2;
        ctxt.fillRect(this.x - halfwidth, this.y - halfwidth, width, width);
    }
    cross(v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
    static fromArray(vals) {
        var x = new Vector();
        x.vals = vals;
        return x;
    }
    loop2d(callback) {
        var counter = new Vector(0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                callback(counter);
            }
        }
    }
    loop3d(callback) {
        var counter = new Vector(0, 0, 0);
        for (counter.x = 0; counter.x < this.x; counter.x++) {
            for (counter.y = 0; counter.y < this.y; counter.y++) {
                for (counter.z = 0; counter.z < this.z; counter.z++) {
                    callback(counter);
                }
            }
        }
    }
}
// (window as any).devtoolsFormatters = [
//     {
//         header: function(obj, config){
//             if(!(obj instanceof Vector)){
//                 return null
//             }
//             if((obj.vals.length == 2)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y}`]
//             }
//             if((obj.vals.length == 3)){
//                 return ["div",{style:""}, `x:${obj.x} y:${obj.y} z:${obj.z}`]
//             }
//         },
//         hasBody: function(obj){
//             return false
//         },
//     }
// ]
class RNG {
    constructor(seed) {
        this.seed = seed;
        this.mod = 4294967296;
        this.multiplier = 1664525;
        this.increment = 1013904223;
    }
    next() {
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod;
        return this.seed;
    }
    norm() {
        return this.next() / this.mod;
    }
    range(min, max) {
        return this.norm() * to(min, max) + min;
    }
}
class Store {
    constructor() {
        this.map = new Map();
        this.counter = 0;
    }
    get(id) {
        return this.map.get(id);
    }
    add(item) {
        item.id = this.counter++;
        this.map.set(item.id, item);
        return item;
    }
    insert(item) {
        this.map.set(item.id, item);
        return item;
    }
    list() {
        return Array.from(this.map.values());
    }
    remove(id) {
        var val = this.map.get(id);
        this.map.delete(id);
        return val;
    }
}
var TAU = Math.PI * 2;
function map(val, from1, from2, to1, to2) {
    return lerp(to1, to2, inverseLerp(val, from1, from2));
}
function inverseLerp(val, a, b) {
    return to(a, val) / to(a, b);
}
function inRange(min, max, value) {
    if (min > max) {
        var temp = min;
        min = max;
        max = temp;
    }
    return value <= max && value >= min;
}
function min(a, b) {
    if (a < b)
        return a;
    return b;
}
function max(a, b) {
    if (a > b)
        return a;
    return b;
}
function clamp(val, min, max) {
    return this.max(this.min(val, max), min);
}
function rangeContain(a1, a2, b1, b2) {
    return max(a1, a2) >= max(b1, b2) && min(a1, a2) <= max(b1, b2);
}
function startMouseListen(localcanvas) {
    var mousepos = new Vector(0, 0);
    document.addEventListener('mousemove', (e) => {
        mousepos.overwrite(getMousePos(localcanvas, e));
    });
    return mousepos;
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(evt.clientX - rect.left, evt.clientY - rect.top);
}
function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback((now - lastUpdate) / 1000);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}
function mod(number, modulus) {
    return ((number % modulus) + modulus) % modulus;
}
function loadTextFiles(strings) {
    var promises = [];
    for (var string of strings) {
        var promise = fetch(string)
            .then(resp => resp.text())
            .then(text => text);
        promises.push(promise);
    }
    return Promise.all(promises);
}
function loadImages(urls) {
    var promises = [];
    for (var url of urls) {
        promises.push(new Promise((res, rej) => {
            var image = new Image();
            image.onload = e => {
                res(image);
            };
            image.src = url;
        }));
    }
    return Promise.all(promises);
}
function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0]);
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i]);
        if (score > bestscore) {
            bestscore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}
function string2html(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.children[0];
}
function lerp(a, b, r) {
    return a + to(a, b) * r;
}
function to(a, b) {
    return b - a;
}
function swap(arr, a = 0, b = 1) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
function first(arr) {
    return arr[0];
}
function last(arr) {
    return arr[arr.length - 1];
}
function create2DArray(size, filler) {
    var result = new Array(size.y);
    for (var i = 0; i < size.y; i++) {
        result[i] = new Array(size.x);
    }
    size.loop2d(v => {
        result[v.y][v.x] = filler(v);
    });
    return result;
}
function get2DArraySize(arr) {
    return new Vector(arr[0].length, arr.length);
}
function index2D(arr, i) {
    return arr[i.x][i.y];
}
function copy2dArray(arr) {
    return create2DArray(get2DArraySize(arr), pos => index2D(arr, pos));
}
function round(number, decimals) {
    var mul = 10 ** decimals;
    return Math.round(number * mul) / mul;
}
var rng = new RNG(0);
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(rng.norm() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
class StopWatch {
    constructor() {
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
        this.paused = true;
    }
    get() {
        var currentamountpaused = 0;
        if (this.paused) {
            currentamountpaused = to(this.pausetimestamp, Date.now());
        }
        return to(this.starttimestamp, Date.now()) - (this.pausetime + currentamountpaused);
    }
    start() {
        this.paused = false;
        this.starttimestamp = Date.now();
        this.pausetime = 0;
    }
    continue() {
        if (this.paused) {
            this.paused = false;
            this.pausetime += to(this.pausetimestamp, Date.now());
        }
    }
    pause() {
        if (this.paused == false) {
            this.paused = true;
            this.pausetimestamp = Date.now();
        }
    }
    reset() {
        this.paused = true;
        this.starttimestamp = Date.now();
        this.pausetimestamp = Date.now();
        this.pausetime = 0;
    }
}
class Rule {
    constructor(message, cb) {
        this.message = message;
        this.cb = cb;
    }
}
class Ability {
    constructor(cb) {
        this.cb = cb;
        // ammo:number = 1
        // maxammo:number = 1
        // ammorechargerate:number = 1000
        // casttime:number = 2000
        // channelduration:number = 3000
        this.cooldown = 1000;
        this.lastfire = Date.now();
        this.rules = [
            new Rule('not ready yet', () => (this.lastfire + this.cooldown) < Date.now()),
        ];
        this.stopwatch = new StopWatch();
        this.ventingtime = 0;
        this.onCastFinished = new EventSystem();
        this.shots = 0;
        this.firing = false;
    }
    //positive if you need to wait 0 or negative if you can call it
    timeTillNextPossibleActivation() {
        return to(Date.now(), this.lastfire + this.cooldown);
    }
    canActivate() {
        return this.rules.every(r => r.cb());
    }
    callActivate() {
        this.cb();
    }
    fire() {
        if (this.firing == false) {
            this.startfire();
        }
        else {
            this.holdfire();
        }
    }
    releasefire() {
        this.firing = false;
    }
    tapfire() {
        this.startfire();
        this.releasefire();
    }
    startfire() {
        if (this.rules.some(r => r.cb())) {
            this.firing = true;
            this.ventingtime = 0;
            this.stopwatch.start();
            this.ventingtime -= this.cooldown;
            this.shots = 1;
            this.lastfire = Date.now();
            this.cb();
        }
    }
    holdfire() {
        this.ventingtime += this.stopwatch.get();
        this.stopwatch.start();
        this.shots = Math.ceil(this.ventingtime / this.cooldown);
        this.ventingtime -= this.shots * this.cooldown;
        this.lastfire = Date.now();
        if (this.shots > 0) {
            this.cb();
        }
    }
}
var AnimType;
(function (AnimType) {
    AnimType[AnimType["once"] = 0] = "once";
    AnimType[AnimType["repeat"] = 1] = "repeat";
    AnimType[AnimType["pingpong"] = 2] = "pingpong";
    AnimType[AnimType["extend"] = 3] = "extend";
})(AnimType || (AnimType = {}));
class Anim {
    constructor() {
        this.animType = AnimType.once;
        this.reverse = false;
        this.duration = 1000;
        this.stopwatch = new StopWatch();
        this.begin = 0;
        this.end = 1;
    }
    get() {
        var cycles = this.stopwatch.get() / this.duration;
        switch (this.animType) {
            case AnimType.once:
                return clamp(lerp(this.begin, this.end, cycles), this.begin, this.end);
            case AnimType.repeat:
                return lerp(this.begin, this.end, mod(cycles, 1));
            case AnimType.pingpong:
                var pingpongcycle = mod(cycles, 2);
                if (pingpongcycle <= 1) {
                    return lerp(this.begin, this.end, pingpongcycle);
                }
                else {
                    return lerp(this.end, this.begin, pingpongcycle - 1);
                }
            case AnimType.extend:
                var distPerCycle = to(this.begin, this.end);
                return Math.floor(cycles) * distPerCycle + lerp(this.begin, this.end, mod(cycles, 1));
        }
    }
}
class Rect {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    collidePoint(point) {
        for (var i = 0; i < this.min.vals.length; i++) {
            if (!inRange(this.min.vals[i], this.max.vals[i], point.vals[i])) {
                return false;
            }
        }
        return true;
    }
    size() {
        return this.min.to(this.max);
    }
    collideBox(other) {
        for (var i = 0; i < 2; i++) {
            if (!rangeOverlap(this.min[i], this.max[i], other.min[i], other.max[i])) {
                return false;
            }
        }
        return true;
    }
    getPoint(relativePos) {
        return this.min.c().add(this.size().mul(relativePos));
    }
    draw(ctxt) {
        var size = this.size();
        ctxt.fillRect(this.min.x, this.min.y, size.x, size.y);
    }
    move(pos) {
        var size = this.size();
        this.min = pos;
        this.max = this.min.c().add(size);
    }
    loop(callback) {
        var temp = this.max.c();
        this.size().loop(v2 => {
            temp.overwrite(v2);
            temp.add(this.min);
            callback(temp);
        });
    }
}
function rangeOverlap(range1A, range1B, range2A, range2B) {
    return range1A <= range2B && range2A <= range1B;
}
class EventQueue {
    constructor() {
        this.idcounter = 0;
        this.onProcessFinished = new EventSystem();
        this.onRuleBroken = new EventSystem();
        this.rules = [];
        this.discoveryidcounter = 0;
        this.listeners = [];
        this.events = [];
    }
    // listenDiscovery(type:string,megacb:(data:any,cb:(cbdata:any) => void) => void){
    //     this.listen(type,(dataAndCb:{data:any,cb:(ads:any) => void}) => {
    //         megacb(dataAndCb.data,dataAndCb.cb)
    //     })
    // }
    // startDiscovery(type:string,data: any, cb: (cbdata: any) => void) {
    //     this.addAndTrigger(type,{data,cb})
    // }
    listenDiscovery(type, cb) {
        this.listen(type, (discovery) => {
            cb(discovery.data, discovery.id);
        });
    }
    startDiscovery(type, data, cb) {
        let createdid = this.discoveryidcounter++;
        let listenerid = this.listen('completediscovery', (discovery) => {
            if (discovery.data.id == createdid) {
                this.unlisten(listenerid);
                cb(discovery.data.data);
            }
        });
        this.addAndTrigger(type, { data, id: createdid });
    }
    completeDiscovery(data, id) {
        this.addAndTrigger('completediscovery', { data, id });
    }
    listen(type, cb) {
        var id = this.idcounter++;
        this.listeners.push({
            id: id,
            type: type,
            cb,
        });
        return id;
    }
    listenOnce(type, cb) {
        let id = this.listen(type, (data) => {
            this.unlisten(id);
            cb(data);
        });
        return id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    process() {
        while (this.events.length > 0) {
            let currentEvent = this.events.shift();
            let listeners = this.listeners.filter(l => l.type == currentEvent.type);
            let brokenrules = this.rules.filter(r => r.type == currentEvent.type && r.rulecb(currentEvent.data) == false);
            if (brokenrules.length == 0) {
                for (let listener of listeners) {
                    listener.cb(currentEvent.data);
                }
            }
            else {
                //todo
                // toastr.error(first(brokenrules).error)
                console.log(first(brokenrules).error);
                this.onRuleBroken.trigger({ event: currentEvent, error: first(brokenrules).error });
            }
        }
        this.onProcessFinished.trigger(0);
    }
    add(type, data) {
        this.events.push({
            type: type,
            data: data,
        });
    }
    addAndTrigger(type, data) {
        this.add(type, data);
        this.process();
    }
    addRule(type, error, rulecb) {
        this.rules.push({ type, error, rulecb });
    }
}
class EventSystem {
    constructor() {
        this.idcounter = 0;
        this.listeners = [];
    }
    listen(cb) {
        var listener = {
            id: this.idcounter++,
            cb: cb,
        };
        this.listeners.push(listener);
        return listener.id;
    }
    unlisten(id) {
        var index = this.listeners.findIndex(o => o.id == id);
        this.listeners.splice(index, 1);
    }
    trigger(val) {
        for (var listener of this.listeners) {
            listener.cb(val);
        }
    }
}
class Helper {
    constructor(store) {
        this.store = store;
        this.store = store;
    }
    getGame() {
        return this.store.list().find(e => e.parent == null);
    }
    getTopCardDeck() {
        return last(this.getDeckCards());
    }
    getTopCardDiscardPile() {
        return last(this.getDiscardPile()._children(e => true));
    }
    getDeckContainer() {
        return this.getGame().child(e => e.name == 'deck');
    }
    getDeckCards() {
        return this.getDeckContainer()._children(e => true);
    }
    getDiscardPile() {
        return this.getGame().child(e => e.name == 'discardpile');
    }
    getPlayersNode() {
        return this.getGame().child(e => e.name == 'players');
    }
    getPlayers() {
        return this.getPlayersNode()._children(e => true);
    }
    getCurrentPlayer() {
        var game = this.getGame();
        var players = this.getPlayers();
        return players[game.turnindex % players.length];
    }
}
class ServerClient {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
        this.output = new EventSystem();
        this.socket.on('message', (data) => {
            this.output.trigger(data);
        });
    }
    input(type, data) {
        this.socket.emit('message', { type, data });
    }
}
class Server {
    constructor() {
        this.output = new EventSystem();
        this.clients = new Store();
        this.onBroadcast = new EventSystem();
        this.gamemanager = new GameManager();
        Entity.globalEntityStore = this.gamemanager.entityStore;
        this.gamemanager.setupListeners();
        this.gamemanager.eventQueue.addAndTrigger('init', null);
        this.gamemanager.eventQueue.onProcessFinished.listen(() => {
            this.gamemanager.broadcastEvent.trigger({ type: 'update', data: this.gamemanager.entityStore.list() });
            //set synced status of updated entities to true
        });
        this.gamemanager.broadcastEvent.listen((event) => {
            for (var client of this.clients.list()) {
                client.input(event.type, event.data);
            }
        });
        this.gamemanager.sendEvent.listen((event) => {
            this.clients.get(event.clientid).input(event.type, event.data);
        });
    }
    connect(client) {
        this.clients.add(client);
        client.input('idreturn', client.id);
        client.socket.on('disconnect', () => {
            this.clients.remove(client.id);
        });
        client.output.listen(e => {
            server.input(e.type, { clientid: client.id, data: e.data });
        });
    }
    input(type, data) {
        this.gamemanager.eventQueue.addAndTrigger(type, data);
    }
    serialize() {
        //only serialize unsynced entitys
        return JSON.stringify(this.gamemanager.entityStore.list());
    }
}
class GameManager {
    constructor() {
        this.eventQueue = new EventQueue();
        this.entityStore = new Store();
        this.broadcastEvent = new EventSystem();
        this.sendEvent = new EventSystem();
    }
    setupListeners() {
        this.eventQueue.onRuleBroken.listen(e => {
            this.sendEvent.trigger({ type: 'error', clientid: e.event.data.clientid, data: e.error });
        });
        this.eventQueue.listen('init', () => {
            this.entityStore = new Store();
            this.helper = new Helper(this.entityStore);
            Entity.globalEntityStore = this.entityStore;
            var game = this.entityStore.add(new Game());
            var discardPile = new Entity({ name: 'discardpile' }).inject(game);
            var players = new Entity({ name: 'players' }).inject(game);
            var deck = new Entity({ name: 'deck' }).inject(game);
            game.status = 'prestart';
        });
        this.eventQueue.listen('playerjoin', (e) => {
            var playersNode = this.helper.getPlayersNode();
            var newentity = new Player({ clientid: e.clientid, name: e.data.name }).inject(playersNode);
        });
        this.eventQueue.listen('gamestart', () => {
            var game = this.helper.getGame();
            game.status = 'started';
            var deck = this.helper.getDeckContainer();
            var discardPile = this.helper.getDiscardPile();
            var players = this.helper.getPlayers();
            deck.removeChildren();
            discardPile.removeChildren();
            players.forEach(p => p.removeChildren());
            for (var house of Object.values(houseMap)) {
                for (var rank of Object.values(rankMap)) {
                    new Card({
                        rank: rank,
                        house: house,
                        url: `./resources/${rank.abbr + house.abbr}.jpg`
                    }).inject(deck);
                }
            }
            new Card({ isJoker: true, url: `./resources/joker.jpg` }).inject(deck);
            new Card({ isJoker: true, url: `./resources/joker.jpg` }).inject(deck);
            shuffle(this.helper.getDeckContainer().children);
            var shuffleddeck = this.helper.getDeckCards();
            for (var player of players) {
                shuffleddeck.splice(0, 5).forEach(card => card.setParent(player));
            }
            shuffleddeck.splice(0, 1)[0].setParent(discardPile);
            this.helper.getGame().currentHouse = this.helper.getTopCardDiscardPile().house;
        });
        // this.eventQueue.addRule('playcard','card is not in your hand',(data) => {
        //     var card = data.card
        //     return this.helper.getCurrentPlayer().id == card.getParent().id
        // })
        this.eventQueue.addRule('playcard', `it's not your turn`, (data) => {
            return data.clientid == this.helper.getCurrentPlayer().clientid;
        });
        this.eventQueue.addRule('playcard', `you're being bullied, either parry with a 2 or joker or accept the bullied cards`, (data) => {
            var card = data.data;
            if (this.helper.getGame().bullycounter > 0) {
                return card.isJoker || card.rank.name == 'two';
            }
            else {
                return true;
            }
        });
        this.eventQueue.addRule('playcard', 'cards house or rank needs to match or the top card has to be a jack or joker', (data) => {
            var card = data.data;
            var topcard = this.helper.getTopCardDiscardPile();
            if (topcard == null) {
                return true;
            }
            return this.helper.getGame().currentHouse.name == card.house.name ||
                topcard.rank.name == card.rank.name ||
                card.rank.name == 'jack' ||
                card.isJoker || topcard.isJoker;
        });
        this.eventQueue.addRule('playcard', 'final card may not be a special card', (data) => {
            var card = data.data;
            var topcard = this.helper.getTopCardDiscardPile();
            if (topcard == null) {
                return true;
            }
            var currentplayer = this.helper.getCurrentPlayer();
            var hand = currentplayer.descendants(e => e.type == 'card');
            if (hand.length == 1) {
                var lastcard = hand[0];
                var isSpecialcard = ['two', 'seven', 'eight', 'jack'].indexOf(lastcard.rank.name) != -1 || lastcard.isJoker;
                return isSpecialcard == false;
            }
            return true;
        });
        this.eventQueue.listen('playcard', (data) => {
            var card = Object.assign(new Card(), data.data);
            var game = this.helper.getGame();
            var currentplayer = this.helper.getCurrentPlayer();
            card.setParent(this.helper.getDiscardPile());
            game.currentHouse = card.house;
            if (currentplayer._children(e => true).length == 0) {
                this.eventQueue.addAndTrigger('gamewon', null);
            }
            else {
                if (card.isJoker) {
                    game.bullycounter += 5;
                    this.incrementTurn(1);
                }
                else if (card.rank.name == 'two') {
                    game.bullycounter += 2;
                    this.incrementTurn(1);
                }
                else if (card.rank.name == 'seven') {
                    //nothing happens besides moving card to discard pile, just play again
                }
                else if (card.rank.name == 'eight') {
                    this.incrementTurn(2);
                }
                else if (card.rank.name == 'jack') {
                    //show 4 housoptions
                    this.chooseHouse(currentplayer, house => {
                        this.helper.getGame().currentHouse = house;
                        this.incrementTurn(1);
                    });
                }
                else {
                    this.incrementTurn(1);
                }
            }
        });
        this.eventQueue.addRule('acceptcards', `it's not your turn`, (data) => {
            return data.clientid == this.helper.getCurrentPlayer().clientid;
        });
        this.eventQueue.listen('acceptcards', () => {
            var currentplayer = this.helper.getCurrentPlayer();
            var topcard = this.helper.getTopCardDiscardPile();
            var game = this.helper.getGame();
            if (topcard.isJoker) {
                this.drawCards(currentplayer, game.bullycounter);
                //dont have to choose a house, any card may be put on top of a joker
            }
            else if (topcard.rank.name == 'two') {
                this.drawCards(currentplayer, game.bullycounter);
                this.incrementTurn(1);
            }
            game.bullycounter = 0;
        });
        this.eventQueue.listen('turnstart', (playerid) => {
            this.broadcastEvent.trigger({ type: 'turnstart', data: playerid });
        });
        this.eventQueue.addRule('pass', `it's not your turn`, (data) => {
            return data.clientid == this.helper.getCurrentPlayer().clientid;
        });
        this.eventQueue.addRule('pass', `you're being bullied, either parry with a 2 or joker or accept the bullied cards`, () => {
            return this.helper.getGame().bullycounter == 0;
        });
        this.eventQueue.listen('pass', () => {
            this.drawCards(this.helper.getCurrentPlayer(), 1);
            this.incrementTurn(1);
        });
        this.eventQueue.listenDiscovery('discoverhouse', (data, id) => {
            data.discoverid = id;
        });
        this.eventQueue.listen('gamewon', () => {
            this.helper.getGame().status = 'finished';
            for (var player of this.helper.getPlayers()) {
                if (player._children(e => true).length == 0) {
                    console.log(player.name);
                    //todo
                    toastr.success(`${player.name} won the game`);
                }
            }
        });
    }
    drawCards(player, count) {
        var deckcontainer = this.helper.getDeckContainer();
        for (var i = 0; i < count; i++) {
            var topcard = this.helper.getTopCardDeck();
            if (topcard == null) {
                var discardcards = this.helper.getDiscardPile()._children(e => true);
                var exceptlast = discardcards.slice(0, discardcards.length - 1);
                shuffle(exceptlast).forEach(c => c.setParent(deckcontainer));
                var topcard = this.helper.getTopCardDeck();
                if (topcard != null) {
                    topcard.setParent(player);
                }
            }
            else {
                topcard.setParent(player);
            }
        }
    }
    incrementTurn(count) {
        var game = this.helper.getGame();
        game.turnindex = (game.turnindex + count) % this.helper.getPlayers().length;
        this.eventQueue.add('turnstart', this.helper.getCurrentPlayer().id);
    }
    chooseHouse(player, cb) {
        player.isDiscoveringHouse = true;
        player.discoverHouseOptions = Object.values(houseMap);
        this.eventQueue.startDiscovery('discoverhouse', player, (data) => {
            player.isDiscoveringHouse = false;
            player.discoverHouseOptions = [];
            cb(data);
        });
    }
}
function Enum2Array(en) {
    return Object.values(en).filter(val => typeof val == "number");
}
class Rank {
    constructor(name, abbr) {
        this.name = name;
        this.abbr = abbr;
    }
}
class House {
    constructor(name, color, abbr) {
        this.name = name;
        this.color = color;
        this.abbr = abbr;
    }
}
var rankMap = {
    two: new Rank('two', '2'),
    three: new Rank('three', '3'),
    four: new Rank('four', '4'),
    five: new Rank('five', '5'),
    six: new Rank('six', '6'),
    seven: new Rank('seven', '7'),
    eight: new Rank('eight', '8'),
    nine: new Rank('nine', '9'),
    ten: new Rank('ten', '10'),
    jack: new Rank('jack', 'J'),
    queen: new Rank('queen', 'Q'),
    king: new Rank('king', 'K'),
    ace: new Rank('ace', 'A'),
};
var houseMap = {
    spades: new House('spades', 'black', 'S'),
    clubs: new House('clubs', 'black', 'C'),
    diamonds: new House('diamonds', 'red', 'D'),
    hearts: new House('hearts', 'red', 'H'),
};
class Entity {
    constructor(init) {
        this.id = null;
        this.parent = null;
        this.type = '';
        this.name = '';
        this.children = [];
        // ordercount = 0
        // sortorder = 0
        this.synced = false;
        Object.assign(this, init);
        this.type = 'entity';
    }
    setChild(child) {
        //remove child from old parent
        var oldparent = Entity.globalEntityStore.get(child.parent);
        if (oldparent != null) {
            remove(oldparent.children, child.id);
        }
        this.children.push(child.id);
        child.parent = this.id;
        // child.sortorder = this.ordercount++
    }
    setParent(parent) {
        if (parent == null) {
            this.parent = null;
        }
        else {
            parent.setChild(this);
        }
    }
    getParent() {
        return Entity.globalEntityStore.get(this.parent);
    }
    descendant(cb) {
        return this.descendants(cb)[0];
    }
    descendants(cb) {
        var children = this._children(cb);
        var grandchildren = children.flatMap(c => c.descendants(cb));
        return children.concat(grandchildren);
    }
    child(cb) {
        return this._children(cb)[0];
    }
    _children(cb) {
        return this.children.map(id => Entity.globalEntityStore.get(id)).filter(cb);
    }
    allChildren() {
        return this._children(() => true);
    }
    remove() {
        remove(this.getParent().children, this.id);
        Entity.globalEntityStore.remove(this.id);
        this.removeChildren();
        return this;
    }
    inject(parent) {
        Entity.globalEntityStore.add(this);
        this.setParent(parent);
        return this;
    }
    removeChildren() {
        this.descendants(() => true).forEach(e => Entity.globalEntityStore.remove(e.id));
        this.children = [];
    }
    ancestor(cb) {
        var current = this;
        while (current != null && cb(current) == false) {
            current = Entity.globalEntityStore.get(current.parent);
        }
        return current;
    }
}
class Game extends Entity {
    constructor() {
        super();
        this.turnindex = 0;
        // shownPlayerid:number
        this.bullycounter = 0;
        this.status = '';
        this.type = 'game';
    }
}
class Card extends Entity {
    constructor(init) {
        super();
        this.isJoker = false;
        this.rank = rankMap.three;
        this.house = houseMap.clubs;
        Object.assign(this, init);
        this.type = 'card';
    }
}
class Player extends Entity {
    constructor(init) {
        super();
        this.discoverHouseOptions = [];
        Object.assign(this, init);
        this.type = 'player';
    }
}
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
/// <reference path="../client/shared/helper.ts" />
/// <reference path="server.ts" />
/// <reference path="gamemanager.ts" />
/// <reference path="../client/shared/models.ts" />
var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = 8000;
app.use(express.static('C:/projects/pesten/client'));
var sessionStore = new Map();
var idcounter = 0;
var server = new Server();
io.on('connection', (socket) => {
    console.log('user connected');
    server.onBroadcast.listen((message) => {
        io.emit('message', message);
    });
    var client = new ServerClient(socket, idcounter++);
    server.connect(client);
    // socket.emit("session", {
    //     sessionID: socket.sessionID,
    //     userID: socket.userID,
    // });
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});
http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCIuLi9jbGllbnQvc2hhcmVkL2hlbHBlci50cyIsInNlcnZlci50cyIsImdhbWVtYW5hZ2VyLnRzIiwiLi4vY2xpZW50L3NoYXJlZC9tb2RlbHMudHMiLCJtYWluc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sTUFBTTtJQUdSLFlBQVksR0FBRyxJQUFhO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsUUFBd0M7UUFDeEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENB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