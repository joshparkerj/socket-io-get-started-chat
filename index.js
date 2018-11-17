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
    io.emit('chat message',`${socket.nickname} connected`);
    console.log(`${socket.nickname} connected`);
    socket.on('disconnect',() => {
        io.emit('chat message',`${socket.nickname} disconnected`);
        console.log(`${socket.nickname} disconnected`);
    })
    socket.on('chat message',msg => {
        io.emit('chat message',`${socket.nickname}: ${msg}`);
        console.log(`${socket.nickname}: ${msg}`);
    })
    socket.on('change name',nickname => {
        io.emit('chat message',`${socket.nickname} changed name to: ${nickname}`);
        console.log(`${socket.nickname} changed name to: ${nickname}`);
        socket.nickname = nickname;
    })
})

http.listen(8080);
