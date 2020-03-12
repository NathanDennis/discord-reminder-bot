const checkForNumbersInMessage = (msg) => {
    const matches = msg.match(/(\d+)/)

    if (!matches || !matches[0]) {
        return msg.channel.send(`${msg.author} - Your reminder message must include a number value, e.g. 'In 2 hours'`)
    }

    if (matches) {
        return matches[0]
    }
}

module.exports = checkForNumbersInMessage