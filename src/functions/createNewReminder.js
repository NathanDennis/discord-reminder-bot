const moment = require('moment')
const formatMessage = require('./formatMessage')
const checkForNumbersInMessage = require('./checkForNumbersInMessage')
const createEmbed = require('./createEmbed')
const saveNewReminder = require('./saveNewReminder')
const setIntervalVerb = require('./setIntervalVerb')

const createNewReminder = (msg) => {
    const formattedMessage = formatMessage(msg)

    // If message isn't a remindme command, cease function execution
    if (!formattedMessage.startsWith('!remindme')) {
        return
    }

    // Determine if message contains a number to assign to intervalInteger
    checkForNumbersInMessage(formattedMessage)

    // Final format for message to be sent at reminderTime
    const messageToDeliverToUser = formattedMessage.replace('!remindme', '')
            
    // Set integer and verb values for moment.add() parameters
    const intervalInteger = parseInt(checkForNumbersInMessage(formattedMessage))
    const intervalVerb = setIntervalVerb(formattedMessage)

    // Format time to send reminder to UTC timezone    
    const reminderTime = moment().utc().add(intervalInteger, intervalVerb).format('YYYY-MM-DD HH:mm:ss')

    // Save reminder to DB
    saveNewReminder(msg.author.id, msg.author.username, messageToDeliverToUser, reminderTime)

    // Send embedded message to author & notify author in channel of remindertime request
    const embed = createEmbed(messageToDeliverToUser, reminderTime)
    msg.author.send(embed)
    msg.channel.send(`${msg.author} - A reminder confirmation has been sent to your DMs. I will DM you again at the requested reminder time`)
}

module.exports = createNewReminder
