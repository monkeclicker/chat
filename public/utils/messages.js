function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

module.exports = {
    appendMessage
}