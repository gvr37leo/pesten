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
        //add some kind of version number or hash verify
        this.upserts = new Set();
        this.deletions = new Set();
        this.versionnumber = 0;
    }
    get(id) {
        return this.map.get(id);
    }
    add(item) {
        item.id = this.counter++;
        return this.insert(item);
    }
    insert(item) {
        this.map.set(item.id, item);
        this.upserts.add(item.id);
        return item;
    }
    flag(id) {
        //would be nicer if flagging was somehow done automatically
        //call this function in the setparent function of entitys
        this.upserts.add(id);
    }
    list() {
        return Array.from(this.map.values());
    }
    remove(id) {
        var val = this.map.get(id);
        this.map.delete(id);
        this.deletions.add(id);
        return val;
    }
    collectChanges() {
        for (var deletion of this.deletions) {
            if (this.upserts.has(deletion)) {
                this.deletions.delete(deletion);
                this.upserts.delete(deletion);
            }
        }
        var deletions = Array.from(this.deletions.keys());
        var upserts = Array.from(this.upserts.entries()).map(e => this.get(e[0]));
        this.upserts.clear();
        this.deletions.clear();
        if (upserts.length > 0 || deletions.length > 0) {
            this.versionnumber++;
        }
        //optimization potential: if delete id present in upserts cancel them both out
        return {
            upserts,
            deletions,
            version: this.versionnumber
        };
    }
    applyChanges(deletions, upserts) {
        for (var upsert of upserts) {
            var local = this.get(upsert.id);
            if (local == null) {
                this.insert(upsert);
                upsert.__proto__ = Entity.prototype;
            }
            else {
                Object.assign(local, upsert);
            }
        }
        for (var deletion of deletions) {
            this.remove(deletion);
        }
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
function shuffle(array, rng) {
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
    getClientPlayer(clientid) {
        return this.getPlayers().find(p => p.clientid == clientid);
    }
    getSessionPlayer(sessionid) {
        return this.getPlayers().find(p => p.sessionid == sessionid);
    }
}
class ServerClient {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
        this.output = new EventSystem();
        this.sessionid = null;
        this.isSynced = false;
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
        this.sessionidcounter = 0;
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
            this.clients.list().forEach(c => c.input(event.type, event.data));
        });
        this.gamemanager.sendEvent.listen((event) => {
            this.clients.list().filter(c => c.sessionid == event.sessionid).forEach(c => c.input(event.type, event.data));
        });
        setInterval(() => {
            var longdcedplayers = this.gamemanager.helper.getPlayers().filter(p => p.disconnected == true && (Date.now() - p.dctimestamp) > 5000);
            longdcedplayers.forEach(p => {
                console.log(`removed disconnected player:${p.name}`);
                p.remove();
            });
            if (longdcedplayers.length > 0) {
                this.updateClients();
            }
        }, 5000);
    }
    updateClients() {
        //deltaupdate maybe
        //should send an update/version number so clients can see if they missed an update
        //or some kind of database checksum but that could be innefficient on big databases
        var changes = this.gamemanager.entityStore.collectChanges();
        var fulldb = this.gamemanager.entityStore.list();
        for (var client of this.clients.list()) {
            if (client.isSynced) {
                if (changes.deletions.length > 0 || changes.upserts.length > 0) {
                    client.input('deltaupdate', changes);
                }
            }
            else {
                client.isSynced = true;
                client.input('update', {
                    version: this.gamemanager.entityStore.versionnumber,
                    data: fulldb
                });
            }
        }
    }
    connect(client) {
        this.clients.add(client);
        let players = this.gamemanager.helper.getPlayers();
        //client does a handshake
        //if client sends sessionID look for a player with that sessionid
        //if not found or client sends no sessionid create a new player with a new sessionid
        //finish handshake by sending client and sessionid
        //when a client disconnects flag player as dc'ed and set dc timestamp after 2 min delete dc'ed players
        //client should connect, check for sessionid in localstore/sessionstorage
        //then initiate handshake send found sessionid
        //save session and client id on client and look in database for player with sessionid = client.sessionid
        client.socket.on('handshake', (data, fn) => {
            let sessionid = data.sessionid;
            if (sessionid == null) {
                sessionid = this.sessionidcounter;
            }
            this.sessionidcounter++;
            this.sessionidcounter = Math.max(sessionid, this.sessionidcounter); //should create random guid instead
            client.sessionid = sessionid;
            console.log(`user connected:${client.sessionid}`);
            let foundplayer = players.find(p => p.sessionid == sessionid);
            if (foundplayer == null) {
                let player = new Player({ clientid: client.id, sessionid: sessionid });
                player.inject(this.gamemanager.helper.getPlayersNode());
            }
            else {
                foundplayer.clientid = client.id;
                foundplayer.disconnected = false;
                //reconnection dont create new player but do change the pointer to the new client
            }
            fn({
                clientid: client.id,
                sessionid: sessionid,
            });
            this.updateClients();
        });
        client.socket.on('disconnect', () => {
            //watch out for multiple connected clients
            this.clients.remove(client.id);
            var sessionplayer = this.gamemanager.helper.getSessionPlayer(client.sessionid);
            console.log(`user disconnected:${client.sessionid}`);
            //this often goes wrong for some reason
            //maybe when multiple clients are connected the old player's clientid gets overwritten
            //also goes wrong when a second tab connects and disconnects
            // check if other clients use the same sessionid
            var connectedclients = this.clients.list().filter(c => c.sessionid == client.sessionid);
            if (connectedclients.length == 0) {
                sessionplayer.disconnected = true;
                sessionplayer.dctimestamp = Date.now();
            }
            this.gamemanager.entityStore.flag(sessionplayer.id);
            this.updateClients();
        });
        client.output.listen(e => {
            server.input(e.type, { clientid: client.id, sessionid: client.sessionid, data: e.data });
        });
    }
    input(type, data) {
        this.gamemanager.eventQueue.addAndTrigger(type, data);
    }
    serialize() {
        return JSON.stringify(this.gamemanager.entityStore.list());
    }
}
class GameManager {
    constructor() {
        this.eventQueue = new EventQueue();
        this.entityStore = new Store();
        this.broadcastEvent = new EventSystem();
        this.sendEvent = new EventSystem();
        this.rng = new RNG(Math.floor(Math.random() * 100000));
    }
    setupListeners() {
        this.eventQueue.onRuleBroken.listen(e => {
            this.sendEvent.trigger({ type: 'error', sessionid: e.event.data.sessionid, data: e.error });
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
            this.eventQueue.add('gamestart', null);
        });
        this.eventQueue.listen('playerjoin', (e) => {
            var player = this.helper.getSessionPlayer(e.sessionid);
            player.name = e.data.name;
            this.drawCards(player, 5);
        });
        this.eventQueue.listen('gamestart', () => {
            var game = this.helper.getGame();
            game.status = 'started';
            game.bullycounter = 0;
            game.turnindex = 0;
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
            shuffle(this.helper.getDeckContainer().children, this.rng);
            var shuffleddeck = this.helper.getDeckCards();
            for (var player of players) {
                this.drawCards(player, 5);
            }
            shuffleddeck.splice(0, 1)[0].setParent(discardPile);
            this.helper.getGame().currentHouse = this.helper.getTopCardDiscardPile().house;
            this.entityStore.flag(game.id);
        });
        // this.eventQueue.addRule('playcard','card is not in your hand',(data) => {
        //     var card = data.card
        //     return this.helper.getCurrentPlayer().id == card.getParent().id
        // })
        this.eventQueue.addRule('playcard', `it's not your turn`, (data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid;
        });
        this.eventQueue.addRule('playcard', `you're being bullied, either parry with a 2 or joker or accept the bullied cards`, (data) => {
            var card = this.helper.store.get(data.data);
            if (this.helper.getGame().bullycounter > 0) {
                return card.isJoker || card.rank.name == 'two';
            }
            else {
                return true;
            }
        });
        this.eventQueue.addRule('playcard', 'cards house or rank needs to match or the top card has to be a jack or joker', (data) => {
            var card = this.helper.store.get(data.data);
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
            var card = this.helper.store.get(data.data);
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
            var card = this.helper.store.get(data.data);
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
            this.entityStore.flag(game.id);
        });
        this.eventQueue.addRule('acceptcards', `it's not your turn`, (data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid;
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
            this.entityStore.flag(game.id);
        });
        this.eventQueue.listen('turnstart', (playerid) => {
            this.broadcastEvent.trigger({ type: 'turnstart', data: playerid });
        });
        this.eventQueue.addRule('pass', `it's not your turn`, (data) => {
            return data.sessionid == this.helper.getCurrentPlayer().sessionid;
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
            this.entityStore.flag(game.id);
        });
        this.eventQueue.listen('debugfinishgame', () => {
            var game = this.helper.getGame();
            game.status = 'finished';
            var firstplayer = this.helper.getPlayers()[0];
            game.winnerplayerid = firstplayer.id;
            this.entityStore.flag(game.id);
        });
        this.eventQueue.listen('requestfullupdate', (data) => {
            this.entityStore.list();
            this.sendEvent.trigger({ sessionid: data.sessionid, type: 'update', data: {
                    version: this.entityStore.versionnumber,
                    data: this.entityStore.list()
                } });
        });
    }
    drawCards(player, count) {
        var deckcontainer = this.helper.getDeckContainer();
        for (var i = 0; i < count; i++) {
            var topcard = this.helper.getTopCardDeck();
            if (topcard == null) {
                var discardcards = this.helper.getDiscardPile()._children(e => true);
                var exceptlast = discardcards.slice(0, discardcards.length - 1);
                shuffle(exceptlast, this.rng).forEach(c => c.setParent(deckcontainer));
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
        this.entityStore.flag(game.id);
    }
    chooseHouse(player, cb) {
        player.isDiscoveringHouse = true;
        player.discoverHouseOptions = Object.values(houseMap);
        this.entityStore.flag(player.id);
        this.eventQueue.startDiscovery('discoverhouse', player, (data) => {
            player.isDiscoveringHouse = false;
            player.discoverHouseOptions = [];
            this.entityStore.flag(player.id);
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
    ace: new Rank('ace', 'S'),
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
        Object.assign(this, init);
        this.type = 'entity';
    }
    setChild(child) {
        //remove child from old parent
        var oldparent = Entity.globalEntityStore.get(child.parent);
        if (oldparent != null) {
            remove(oldparent.children, child.id);
            Entity.globalEntityStore.flag(oldparent.id);
        }
        this.children.push(child.id);
        child.parent = this.id;
        Entity.globalEntityStore.flag(child.id);
        Entity.globalEntityStore.flag(this.id);
    }
    setParent(parent) {
        if (parent == null) {
            this.parent = null;
        }
        else {
            parent.setChild(this);
        }
    }
    set(obj) {
        Entity.globalEntityStore.flag(this.id);
        Object.assign(this, obj);
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
        Entity.globalEntityStore.flag(this.parent);
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
        Entity.globalEntityStore.flag(this.id);
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
        this.disconnected = false;
        this.dctimestamp = 0;
        Object.assign(this, init);
        this.type = 'player';
    }
}
/// <reference path="server/libs/vector/vector.ts" />
/// <reference path="server/libs/utils/rng.ts" />
/// <reference path="client/libs/utils/store.ts" />
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
    server.onBroadcast.listen((message) => {
        io.emit('message', message);
    });
    var client = new ServerClient(socket, idcounter++);
    server.connect(client);
    socket.on('disconnect', () => {
    });
});
http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZlci9saWJzL3ZlY3Rvci92ZWN0b3IudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9ybmcudHMiLCJjbGllbnQvbGlicy91dGlscy9zdG9yZS50cyIsInNlcnZlci9saWJzL3V0aWxzL3RhYmxlLnRzIiwic2VydmVyL2xpYnMvdXRpbHMvdXRpbHMudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJzZXJ2ZXIvbGlicy91dGlscy9hYmlsaXR5LnRzIiwic2VydmVyL2xpYnMvdXRpbHMvYW5pbS50cyIsInNlcnZlci9saWJzL3JlY3QvcmVjdC50cyIsInNlcnZlci9saWJzL2V2ZW50L2V2ZW50cXVldWUudHMiLCJzZXJ2ZXIvbGlicy9ldmVudC9ldmVudHN5c3RlbS50cyIsImNsaWVudC9zaGFyZWQvaGVscGVyLnRzIiwic2VydmVyL3NlcnZlci50cyIsInNlcnZlci9nYW1lbWFuYWdlci50cyIsImNsaWVudC9zaGFyZWQvbW9kZWxzLnRzIiwibWFpbnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE1BQU07SUFHUixZQUFZLEdBQUcsSUFBYTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQXdDO1FBQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdB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