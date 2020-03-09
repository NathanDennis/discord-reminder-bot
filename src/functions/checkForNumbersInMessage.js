const checkForNumbersInMessage = () => {
    const matches = formattedMessage.match(/(\d+)/)

    if (matches) {
        return matches[0]
    }
}

module.exports = checkForNumbersInMessage