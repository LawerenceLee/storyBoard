const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server running");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`)

    // Disconnect
    socket.on('disconnect', function(data) {
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1)
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected`);
    });

    // Send Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    })

    function updateUsernames() {
        io.sockets.emit('get users', users)
    }

    // new user
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username)
        updateUsernames();

    })
})
