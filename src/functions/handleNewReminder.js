// const checkForNumbersInMessage = require('./checkForNumbersInMessage')
const moment = require('moment')
const { MessageEmbed } = require('discord.js')

const db = require('../../db/config')


const handleNewReminder = (msg) => {
        // trim msg.content of all excess whitespace and format to remove !remindme from the message
        const formattedMessage = msg.content.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").toLowerCase()

        // Determine if message contains a number to assign to intervalInteger
        const checkForNumbersInMessage = () => {
            const matches = formattedMessage.match(/(\d+)/)

            if (matches) {
                return matches[0]
            }
        }

        // Final format for message to be sent at reminderTime
        const messageToDeliverToUser = formattedMessage.replace('!remindme', '')
            
        // Set integer and verb values for moment.add() parameters
        let intervalInteger = parseInt(checkForNumbersInMessage())
        let intervalVerb = ''
    
        // Assign values to intervalVerb & intervalInteger to determine reminderTime
        if (formattedMessage.includes('minutes') || (formattedMessage.includes('minute'))) {
            intervalVerb = 'm'
        }
    
        if (formattedMessage.includes('hours') || formattedMessage.includes('hour')) {
            intervalVerb = 'h'
        }
    
        if (formattedMessage.includes('days') || formattedMessage.includes('day')) {
            intervalVerb = 'd'
        }
    
        if (formattedMessage.includes('weeks') || formattedMessage.includes('week')) {
            intervalVerb = 'w'
        }
    
        if (formattedMessage.includes('months') || formattedMessage.includes('month')) {
            intervalVerb = 'M'
        }
    
        if (formattedMessage.includes('years') || formattedMessage.includes('year')) {
            intervalVerb = 'y'
        }
        
        // Logic for !remindme command
        if (formattedMessage.startsWith('!remindme')) {
    
            // Format current time, and time to send reminder, to UTC timezone
            const currentTime = moment().utc().format('YYYY-MM-DD HH:mm:ss')
            const reminderTime = moment().utc().add(intervalInteger, intervalVerb).format('YYYY-MM-DD HH:mm:ss')
    
            // Create embedded message to DM to user with Title and Description
            const embed = new MessageEmbed()
                .setTitle(`New reminder: ${messageToDeliverToUser}`)
                .setDescription(`Reminder set for: ${reminderTime}`)
            msg.author.send(embed)
            msg.channel.send(`${msg.author} - A reminder confirmation has been sent to your DMs. I will DM you again at the requested reminder time`)
    
            // Add reminder to DB
            db.serialize(() => {
                db.run("INSERT INTO reminders (userID, userName, message, createdAt, reminderTime) VALUES (?, ?, ?, ?, ?)", [msg.author.id, msg.author.username, messageToDeliverToUser, currentTime, reminderTime])
    
                db.run("SELECT * FROM reminders", (error) => {
                    if (error) {
                        return console.log(error)
                    }
                })
            })
        }
}

module.exports = handleNewReminder