const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/index.css', (req,res) => {
    res.sendFile(__dirname + '/index.css');
})

io.on('connection',socket => {
    console.log('a user connected');
    socket.on('disconnect',() => {
        console.log('user disconnected');
    })
    socket.on('chat message',msg => {
        console.log(`message: ${msg}`);
        io.emit('chat message',msg);
    })
})

http.listen(8080);