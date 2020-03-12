const createNewReminder = require('./createNewReminder')
const formatMessage = require('./formatMessage')

const handleNewReminder = (msg) => {
    const formattedMessage = formatMessage(msg.content)

    // If message isn't a remindme command, cease function execution
    if (!formattedMessage.startsWith('!remindme')) {
        return
    }

    createNewReminder(msg)
}

module.exports = handleNewReminder