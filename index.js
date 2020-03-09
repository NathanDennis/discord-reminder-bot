// db setup
const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/reminders.db', sqlite3.OPEN_READWRITE, (error) => {
    if (error) {
        return console.log(error.message)
    }

    console.log('Connected to the SQlite database')
})

const cron = require('node-cron')
const selectMessage = () => {
    db.serialize(() => {
        db.each("SELECT * FROM reminders", (error, row) => {
            console.log(`${row.id} : ${row.message}`)
        })
    })
    db.close()
}

cron.schedule('48 22 8 3 *', selectMessage)

const { Client, MessageEmbed } = require('discord.js')
const client = new Client()
const moment = require('moment')
const dotenv = require('dotenv')
dotenv.config()

const { TOKEN } = process.env

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
    // trim msg.content of all excess whitespace
    const message = msg.content.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").toLowerCase()

    // Determine if message contains a number to assign to intervalInteger
    const checkForNumbersInMessage = () => {
        const matches = message.match(/(\d+)/)

        if (matches) {
            return matches[0]
        }
    }
        
    // Set integer and verb values for moment.add() parameters
    let intervalInteger = parseInt(checkForNumbersInMessage())
    let intervalVerb = ''

    // Assign values to intervalVerb & intervalInteger to determine reminderTime
    if (message.includes('minutes') || (message.includes('minutes'))) {
        intervalVerb = 'm'
    }

    if (message.includes('hours') || message.includes('hour')) {
        intervalVerb = 'h'
    }

    if (message.includes('days') || message.includes('day')) {
        intervalVerb = 'd'
    }

    if (message.includes('weeks') || message.includes('week')) {
        intervalVerb = 'w'
    }

    if (message.includes('months') || message.includes('month')) {
        intervalVerb = 'M'
    }
    
    // Logic for !remindme command
    if (message.startsWith('!remindme')) {
        const currentTime = moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
        const reminderTime = moment().add(intervalInteger, intervalVerb).format('YYYY-DD-MM HH:mm:ss') //2020-03-09 02:21:20
        // console.log(`Current time: ${currentTime}`)
        // console.log(`Requested reminder time: ${reminderTime}`)
        console.log(msg.author)

        // console.log(`Message from user: ${message}`)
        // console.log('==============')
        // console.log(`Verb: ${intervalVerb}`)
        // console.log(typeof(intervalVerb))
        // console.log(`Integer: ${intervalInteger}`)
        // console.log(typeof(intervalInteger))
        // console.log('============')
        // console.log(`Current time: ${currentTime}`)
        // console.log(`Reminder time: ${reminderTime}`)

        const embed = new MessageEmbed()
            .setTitle('New reminder:')
            .setDescription(`Reminder set for: ${reminderTime}`)
        // msg.author.send(embed)
        msg.channel.send(`${msg.author} - A reminder confirmation has been sent to your DMs. I will DM you again at the requested reminder time`)

        // Add reminder to DB
        db.serialize(() => {
            db.run("INSERT INTO reminders (user, message, reminderTime) VALUES (?, ?, ?)", [msg.author.username, message, reminderTime])

            db.run("SELECT * FROM reminders", (error) => {
                if (error) {
                    return console.log(error)
                }
                // Close db connection after saving
                db.close()
            })
        })
    }
})

client.login(TOKEN).then(() => {
    console.log('We logged in bois')
}).catch(error => {
    console.log(error)
})