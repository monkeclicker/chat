/*
socket.emit() returns to only the user
socket.broadcast.emit() returns to everyone but the user
io.emit() returns to everyone
*/


const socket = io();
const username = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const sendContainer = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

sendContainer.addEventListener('submit', e => {
    e.preventDefault();


    if (messageInput.value.toLowerCase().trim() === "!help") {
        setTimeout(function() {
            socket.emit('help', 'Admin | Use !help list for a list of commands you can use!')
        })
    }
    if (messageInput.value.toLowerCase().trim() === "!help list") {
        setTimeout(function() {
            socket.emit('help', 'Admin | Commands \n !help - A list of commands for server information\n!information - Information about the server and the creator\n!user-info - Information about yourself\n!server-members - The number of members currently in the server')
        })
    }
    if (messageInput.value.toLowerCase().trim() === "!server-members") {
        setTimeout(function() {
            socket.emit('room-users')
        })
    }

    const message = messageInput.value
    appendMessage(`You | ${message}`)
    socket.emit('chat-message', message)
    messageInput.value = ''
})

socket.emit('username', username)

socket.on('user-connected', data => {
    appendMessage(data)
})

socket.on('user-disconnected', data => {
    appendMessage(data)
})

socket.on('help-message', data => {
    appendMessage(data)
})

socket.on('chat-message', data => {
    appendMessage(`${data.name} | ${data.message}`)
    messageContainer.scrollTop = messageContainer.scrollHeight;
})


socket.on('message', message => {
    appendMessage(message)
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message
    messageContainer.append(messageElement)
}