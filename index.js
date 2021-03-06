const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const connectedUsers = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/index.css', (req, res) => {
    res.sendFile(__dirname + '/index.css');
})

app.get('/favicon.ico',(req,res) => {
  res.sendFile(__dirname + '/favicon.ico');
})

io.on('connection', socket => {
    socket.nickname = 'anonymous coward';
    socket.broadcast.emit('user connected', socket.nickname);
    console.log(`${socket.nickname} connected`);
    socket.on('typing', () => {
        socket.broadcast.emit('typing message', socket.nickname);
        console.log(`${socket.nickname} is typing...`)
    })
    socket.on('chat message', msg => {
        socket.broadcast.emit('chat message', JSON.stringify({ n: socket.nickname, m: msg }));
        console.log(`${socket.nickname}: ${msg}`);
    })
    socket.on('private message', msg => {
        let message = JSON.parse(msg);
        connectedUsers[message.recipient].emit('private message', JSON.stringify({ n: socket.nickname, m: message.m }));
        console.log(`To ${message.recipient}: Private: ${socket.nickname}: ${message.m}`);

    })
    socket.on('change name', nickname => {
        socket.broadcast.emit('name change', JSON.stringify({ old: socket.nickname, new: nickname }));
        console.log(`${socket.nickname} changed name to: ${nickname}`);
        connectedUsers[nickname] = socket;
        socket.nickname = nickname;
    })
    socket.on('disconnect', () => {
        io.emit('user disconnected', socket.nickname);
        console.log(`${socket.nickname} disconnected`);
    })
})

http.listen(process.env.PORT || 8080);
