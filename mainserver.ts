

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







var express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = process.env.PORT || 8000

app.use(express.static(__dirname + '/client'))

var sessionStore = new Map<number,any>()
var idcounter = 0
var server = new Server()

io.on('connection', (socket) => {
    

    server.onBroadcast.listen((message) => {
        io.emit('message',message)
    })
    var client = new ServerClient(socket,idcounter++)
    server.connect(client)

    socket.on('disconnect', () => {
        
    })
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})