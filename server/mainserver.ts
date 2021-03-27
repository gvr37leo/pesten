

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







var express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = 8000

app.use(express.static(__dirname + '/../client'))

var sessionStore = new Map<number,any>()
var idcounter = 0
var server = new Server()

io.on('connection', (socket) => {
    console.log('user connected')

    server.onBroadcast.listen((message) => {
        io.emit('message',message)
    })
    var client = new ServerClient(socket,idcounter++)
    server.connect(client)

    // socket.emit("session", {
    //     sessionID: socket.sessionID,
    //     userID: socket.userID,
    // });

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})