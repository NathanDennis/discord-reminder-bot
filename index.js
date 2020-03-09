// db setup
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/reminders.db', sqlite3.OPEN_READWRITE, (error) => {
    if (error) {
        return console.log(error.message)
    }

    console.log('Connected to the SQlite database')
})

const { Client, MessageEmbed } = require('discord.js')
const client = new Client()
const moment = require('moment')
const dotenv = require('dotenv')
dotenv.config()

const { TOKEN } = process.env

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)

})

const checkForReminders = () => {
    db.serialize(() => {
        // Select all messages older than the current dateTime
        db.each("SELECT id, reminderTime, userID, message FROM reminders WHERE reminderTime < DATETIME()", (error, row) => {
            if (error || !row) {
                return console.log('Error or no row found')
            }

            // If reminders are found, fetch userIDs, then send the requested reminder through DM
            client.users.fetch(row.userID).then((user) => {
                user.send(`Hi, you asked to be reminded "${row.message}" - That's right now!`).catch(console.error)
                console.log(`Message delivered: ${row.message}`)
                console.log(`Message deleted successfully`)

            // Delete message after DMing to user 
            db.run("DELETE FROM reminders WHERE id = ?", [row.id])
                console.log('Message sent and removed successfully')
            })
        })    
    })
}

// Run checkForReminders every 60 seconds to scan DB for outstanding reminders
setInterval(checkForReminders, 60000)

// 
client.on('message', msg => {

    // trim msg.content of all excess whitespace and format to remove !remindme from the message
    const formattedMessage = msg.content.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").toLowerCase()
    const messageToDeliverToUser = formattedMessage.replace('!remindme', '')

    // Determine if message contains a number to assign to intervalInteger
    const checkForNumbersInMessage = () => {
        const matches = formattedMessage.match(/(\d+)/)

        if (matches) {
            return matches[0]
        }
    }
        
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
})

// Log bot into discord
client.login(TOKEN).then(() => {
    console.log('We logged in bois')
}).catch(error => {
    console.log(error)
})