const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
require('dotenv').config();

const port = process.env.PORT || 3000
const users = {}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

io.on('connection', socket => {
    socket.emit('message', 'Admin | Welcome to Charlie\'s Chat App! Use !help to navigate the website!')

    socket.on('username', (data) => {
        users[socket.id] = data.username;
        socket.broadcast.emit('user-connected', `${data.username} connected to the server`)
    })

    socket.on('help', (data) => {
        io.emit('help-message', data)
    })

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', {
            message: data,
            name: users[socket.id]
        })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', `${users[socket.id]} has disconnected from the server`)
        delete users[socket.id]
    })
})


server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})