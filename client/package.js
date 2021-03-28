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
var keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
function getMoveInput() {
    var dir = new Vector(0, 0);
    if (keys['a'])
        dir.x--; //left
    if (keys['w'])
        dir.y++; //up
    if (keys['d'])
        dir.x++; //right
    if (keys['s'])
        dir.y--; //down
    return dir;
}
function getMoveInputYFlipped() {
    var input = getMoveInput();
    input.y *= -1;
    return input;
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
class Client {
    constructor() {
        this.output = new EventSystem();
        this.id = null;
    }
    input(type, data) {
        if (type == 'update') {
            this.entityStore = this.deserialize(data);
            Entity.globalEntityStore = this.entityStore;
            this.helper = new Helper(this.entityStore);
            this.updateHtml();
        }
        if (type == 'idreturn') {
            this.id = data;
        }
        if (type == 'error') {
            toastr.error(data);
        }
    }
    updateHtml() {
        this.root = MainApp({ client: this });
        renderHTML();
    }
    deserialize(data) {
        var entities = data;
        var store = new Store();
        for (var entity of entities) {
            entity.__proto__ = Entity.prototype;
            store.insert(entity);
        }
        return store;
    }
}
class CardComp extends React.Component {
    render() {
        var card = this.props.card;
        return (React.createElement("div", { className: "card", style: { borderRadius: "3px", background: "black", border: "1px solid white", padding: "10px", margin: "10px", cursor: this.props.onClick != null ? 'pointer' : 'default' }, onClick: this.props.onClick },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
                React.createElement("div", { style: { display: "flex", justifyContent: "center", margin: "10px" } }, (() => {
                    if (card.isJoker) {
                        return React.createElement("div", null, "Joker");
                    }
                    else {
                        return React.createElement(React.Fragment, null,
                            React.createElement("div", { style: { marginRight: '20px' } }, card.rank.name),
                            React.createElement("div", null, card.house.name));
                    }
                })()),
                React.createElement("img", { style: { aspectRatio: '1/1.528' }, width: "100px", src: card.url }))));
    }
}
function RenderHomepage(props) {
    var game = props.client.helper.getGame();
    var players = props.client.helper.getPlayers();
    var topcard = props.client.helper.getTopCardDiscardPile();
    var clientplayer = players.find(p => p.clientid == props.client.id);
    var currentplayercards = clientplayer._children(() => true);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "space-between" } },
            React.createElement("div", { style: { display: "flex", flexGrow: '1', alignItems: 'center' } },
                React.createElement("div", { style: { marginLeft: '40px' } }, players.map(p => React.createElement(RenderPlayer, { client: props.client, onClick: () => {
                    }, key: p.id, player: p }))),
                React.createElement("div", { style: { flexGrow: '1', display: 'flex', justifyContent: 'center', alignItems: "center" } },
                    (() => {
                        if (game.bullycounter > 0) {
                            return React.createElement("div", { style: { cursor: 'pointer', border: '1px solid white', margin: '40px', padding: '10px' }, onClick: () => {
                                    props.client.output.trigger({ type: 'acceptcards', data: null });
                                } },
                                "accept cards ",
                                game.bullycounter);
                        }
                        else {
                            return null;
                        }
                    })(),
                    React.createElement("div", { style: { cursor: 'pointer', border: '1px solid white', margin: '40px', padding: '10px' }, onClick: () => {
                            props.client.output.trigger({ type: 'pass', data: null });
                        } },
                        React.createElement("div", null, "draw a card and pass"),
                        React.createElement("div", null,
                            props.client.helper.getDeckCards().length,
                            " remaining")),
                    React.createElement(CardComp, { card: topcard }))),
            React.createElement("div", { style: { display: "flex", justifyContent: "center", flexWrap: "wrap", overflow: "auto", margin: "20px", border: "1px solid white" } }, currentplayercards.map((c) => React.createElement(CardComp, { onClick: () => {
                    props.client.output.trigger({ type: 'playcard', data: c });
                }, key: c.id, card: c })))),
        React.createElement(Modal, { visible: clientplayer.isDiscoveringHouse },
            React.createElement("div", { style: { padding: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap" } }, clientplayer.discoverHouseOptions.map((house, i) => {
                return React.createElement("img", { key: i, width: "180px", style: { cursor: "pointer", margin: "20px" }, src: `./resources/K${house.abbr}.jpg`, onClick: () => {
                        props.client.output.trigger({ type: 'completediscovery', data: { data: house, id: clientplayer.discoverid } });
                    } });
            })))));
}
function Modal(props) {
    return (React.createElement("div", { style: { display: props.visible ? "" : "none", borderRadius: "3px", position: "absolute", top: "100px", left: "30%", right: "30%", bottom: "100px", border: "1px solid white", background: "white", boxShadow: "0px 6px 5px 5px rgba(0,0,0,0.5)" } },
        React.createElement("div", null),
        React.createElement("div", null, props.children)));
}
function RenderPlayer(props) {
    var currentplayer = props.client.helper.getCurrentPlayer();
    var bordercolor = 'white';
    if (currentplayer.id == props.player.id) {
        bordercolor = 'red';
    }
    var highlightcolor = 'black';
    if (props.player.clientid == props.client.id) {
        highlightcolor = 'blue';
    }
    var cardchildren = props.player._children(e => true);
    return (React.createElement("div", { onClick: props.onClick, className: "player", style: { margin: '10px', border: `3px solid ${highlightcolor}` } },
        React.createElement("div", { style: { padding: '10px', border: `1px solid ${bordercolor}` } },
            React.createElement("div", null,
                props.player.name,
                " ",
                props.player.clientid == props.client.id ? "(yourself)" : ""),
            React.createElement("div", null, cardchildren.length))));
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
function StartScreen(props) {
    return React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" } },
        React.createElement("div", null,
            React.createElement("input", { placeholder: "Name", id: "name", style: { marginRight: "20px", padding: "10px" } }),
            React.createElement("button", { style: { padding: "10px 20px" }, onClick: () => {
                    var name = document.querySelector('#name').value;
                    props.client.output.trigger({ type: 'playerjoin', data: { name: name } });
                } }, "join")));
}
var shown = true;
function MainApp(props) {
    var game = client.helper.getGame();
    var players = props.client.helper.getPlayers();
    var clientplayer = players.find(p => p.clientid == props.client.id);
    return (React.createElement(React.Fragment, null,
        (() => {
            //check if clientplayer has a name
            if (clientplayer.name == '') {
                return React.createElement(StartScreen, { client: props.client });
            }
            if (game.status == 'started') {
                return React.createElement(RenderHomepage, { client: props.client });
            }
            if (game.status == 'finished') {
                return React.createElement(GameWonScreen, { client: props.client });
            }
        })(),
        React.createElement("div", { style: { position: "absolute", color: "black", top: "10px", right: "10px", padding: "20px", background: "white", borderRadius: "3px" } },
            React.createElement("div", null,
                "clientid:",
                props.client.id),
            React.createElement("div", { style: { marginBottom: "10px" } },
                React.createElement("button", { onClick: () => {
                        shown = !shown;
                        client.updateHtml();
                    } }, shown ? "hide" : "show")),
            (() => {
                if (shown) {
                    return React.createElement(React.Fragment, null,
                        React.createElement("div", { style: { marginBottom: "10px" } },
                            React.createElement("button", { onClick: () => {
                                    props.client.output.trigger({ type: 'gamestart', data: {} });
                                } }, "start new game")),
                        React.createElement("div", { style: { marginBottom: "10px" } },
                            React.createElement("button", { onClick: () => {
                                    props.client.output.trigger({ type: 'debugfinishgame', data: {} });
                                } }, "debug end game")));
                }
            })())));
}
function GameWonScreen(props) {
    var game = props.client.helper.getGame();
    var players = props.client.helper.getPlayers();
    var winningplayer = players.find(p => p.id == game.winnerplayerid);
    return React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" } },
        React.createElement("div", null, winningplayer === null || winningplayer === void 0 ? void 0 :
            winningplayer.name,
            " has won the game"));
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
//heroku
//sessions
//bug with hanging cards in discardpile
const socket = io();
var userID = null;
var client = new Client();
client.output.listen((val) => {
    socket.emit('message', val);
});
socket.on('message', (message) => {
    client.input(message.type, message.data);
});
socket.on('sessionID', ({ sessionID, userID }) => {
    console.log(`sessionID:${sessionID}`);
    userID = userID;
    localStorage.setItem('sessionID', sessionID);
});
var appel = document.querySelector('#app');
function renderHTML() {
    ReactDOM.render(client.root, appel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYnMvdmVjdG9yL3ZlY3Rvci50cyIsImxpYnMvdXRpbHMvcm5nLnRzIiwibGlicy91dGlscy9zdG9yZS50cyIsImxpYnMvdXRpbHMvdGFibGUudHMiLCJsaWJzL3V0aWxzL3V0aWxzLnRzIiwibGlicy91dGlscy9zdG9wd2F0Y2gudHMiLCJsaWJzL3V0aWxzL2FiaWxpdHkudHMiLCJsaWJzL3V0aWxzL2FuaW0udHMiLCJsaWJzL3JlY3QvcmVjdC50cyIsImxpYnMvZXZlbnQvZXZlbnRxdWV1ZS50cyIsImxpYnMvZXZlbnQvZXZlbnRzeXN0ZW0udHMiLCJjbGllbnQudHMiLCJ0c3gvY2FyZC50c3giLCJ0c3gvaG9tZXBhZ2UudHN4IiwidHN4L21vZGFsLnRzeCIsInRzeC9wbGF5ZXIudHN4Iiwic2hhcmVkL21vZGVscy50cyIsInNoYXJlZC9oZWxwZXIudHMiLCJ0c3gvc3RhcnRzY3JlZW4udHN4IiwidHN4L21haW5hcHAudHN4IiwidHN4L2dhbWV3b25zY3JlZW4udHN4IiwibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE1BQU07SUFHUixZQUFZLEdBQUcsSUFBYTtRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQXdDO1FBQ3hDLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQTtTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxDQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25ELENBQUM7SUFFRCxLQUFLO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNELENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsQ0FBQztJQUVELEdB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