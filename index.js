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
    // console.log(socket);
    socket.nickname = 'anonymous coward';
    socket.broadcast.emit('user connected',socket.nickname);
    console.log(`${socket.nickname} connected`);
    socket.on('typing',() => {
        socket.broadcast.emit('typing message',socket.nickname);
        console.log(`${socket.nickname} is typing...`)
    })
    socket.on('chat message',msg => {
        socket.broadcast.emit('chat message',JSON.stringify({n: socket.nickname, m: msg}));
        console.log(`${socket.nickname}: ${msg}`);
    })
    socket.on('change name',nickname => {
        socket.broadcast.emit('name change',JSON.stringify({old: socket.nickname, new: nickname}));
        console.log(`${socket.nickname} changed name to: ${nickname}`);
        socket.nickname = nickname;
    })
    socket.on('disconnect',() => {
        io.emit('user disconnected',socket.nickname);
        console.log(`${socket.nickname} disconnected`);
    })
})

http.listen(8080);
