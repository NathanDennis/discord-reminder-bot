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

    // Set current time and time to set reminder for
    if (message === 'ping') {
        msg.channel.send('pong')
    }

    if (message.includes('minutes')) {
        intervalVerb = 'minutes'
    }
    if (message.includes('hours')) {
        intervalVerb = 'hours'
    }
    
    if (message.startsWith('!remindme')) {
        const currentTime = moment().format('HH:mm')
        const reminderTime = moment().add(intervalInteger, intervalVerb).format('HH:mm')
        console.log(`Current time: ${currentTime}`)
        console.log(`Requested reminder time: ${reminderTime}`)

        console.log(`Message from user: ${message}`)
        console.log('==============')
        console.log()
        console.log(`Verb: ${intervalVerb}`)
        console.log(typeof(intervalVerb))
        console.log(`Integer: ${intervalInteger}`)
        console.log(typeof(intervalInteger))
        console.log('============')
        console.log(`Current time: ${currentTime}`)
        console.log(`Reminder time: ${reminderTime}`)

        const embed = new MessageEmbed()
            .setTitle('New reminder:')
            .setDescription(`Reminder set for: ${reminderTime}`)
        msg.channel.send(embed)
    }
})


// client.on('message', message => {
//     // If the message is "ping"
//     if (message.content === 'ping') {
//       // Send "pong" to the same channel
//       message.channel.send('pong');
//     }
//   });

client.login(TOKEN).then(() => {
    console.log('We logged in bois')
}).catch(error => {
    console.log(error)
})