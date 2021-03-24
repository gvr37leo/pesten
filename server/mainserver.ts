var express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var port = 8000

// app.use(express.static('C:/projects/pesten/client'))

app.get('/', (req, res) => {
    res.sendFile('C:/projects/pesten/client/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('hello',(data) => {
        console.log(data)
    })

    socket.emit('message',{test:'waddup'})
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})