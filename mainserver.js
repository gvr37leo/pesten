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
            this.updateClients();
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
    updateClients() {
        this.gamemanager.broadcastEvent.trigger({ type: 'update', data: this.gamemanager.entityStore.list() });
    }
    connect(client) {
        this.clients.add(client);
        client.input('idreturn', client.id);
        var player = new Player({ clientid: client.id });
        player.inject(this.gamemanager.helper.getPlayersNode());
        this.updateClients();
        client.socket.on('disconnect', () => {
            player.remove();
            //maybe not remove but set as dced and allow people to return via sessionid
            this.clients.remove(client.id);
            this.updateClients();
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
            var player = this.helper.getPlayers().find(p => p.clientid == e.clientid);
            player.name = e.data.name;
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
            var game = this.helper.getGame();
            game.status = 'finished';
            for (var player of this.helper.getPlayers()) {
                if (player._children(e => true).length == 0) {
                    console.log(`${player.name} won the game`);
                    game.winnerplayerid = player.id;
                }
            }
        });
        this.eventQueue.listen('debugfinishgame', () => {
            var game = this.helper.getGame();
            game.status = 'finished';
            var firstplayer = this.helper.getPlayers()[0];
            game.winnerplayerid = firstplayer.id;
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
/// <reference path="server/libs/vector/vector.ts" />
/// <reference path="server/libs/utils/rng.ts" />
/// <reference path="server/libs/utils/store.ts" />
/// <reference path="server/libs/utils/table.ts" />
/// <reference path="server/libs/utils/utils.ts" />
/// <reference path="server/libs/utils/stopwatch.ts" />
/// <reference path="server/libs/utils/ability.ts" />
/// <reference path="server/libs/utils/anim.ts" />
/// <reference path="server/libs/rect/rect.ts" />
/// <reference path="server/libs/event/eventqueue.ts" />
/// <reference path="server/libs/event/eventsystem.ts" />
/// <reference path="client/shared/helper.ts" />
/// <reference path="server/server.ts" />
/// <reference path="server/gamemanager.ts" />
/// <reference path="client/shared/models.ts" />
var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = process.env.PORT || 8000;
app.use(express.static(__dirname + '/client'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlci9saWJzL3ZlY3Rvci92ZWN0b3IudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9ybmcudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9zdG9yZS50cyIsInNlcnZlci9saWJzL3V0aWxzL3RhYmxlLnRzIiwic2VydmVyL2xpYnMvdXRpbHMvdXRpbHMudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9hYmlsaXR5LnRzIiwic2VydmVyL2xpYnMvdXRpbHMvYW5pbS50cyIsInNlcnZlci9saWJzL3JlY3QvcmVjdC50cyIsInNlcnZlci9saWJzL2V2ZW50L2V2ZW50cXVldWUudHMiLCJzZXJ2ZXIvbGlicy9ldmVudC9ldmVudHN5c3RlbS50cyIsImNsaWVudC9zaGFyZWQvaGVscGVyLnRzIiwic2VydmVyL3NlcnZlci50cyIsInNlcnZlci9nYW1lbWFuYWdlci50cyIsImNsaWVudC9zaGFyZWQvbW9kZWxzLnRzIiwibWFpbnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE1BQU07SUFHUixZQUFZLEdBQUcsSUFBYTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQXdDO1FBQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdB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