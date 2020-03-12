// Discord, Moment & dotenv setup
const client = require('./src/discord-config')
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env

// Bot functions import
const checkForReminders = require('./src/functions/checkForReminders')
// const handleNewReminder = require('./src/functions/handleNewReminder')
const createNewReminder = require('./src/functions/createNewReminder')

// Confirm successful log in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

// Run checkForReminders every 60 seconds to scan DB for outstanding reminders
setInterval(checkForReminders, 10000)

// Parse reminder request, save to DB, DM confirmation to user
client.on('message', (msg) => {
    createNewReminder(msg)
})

// Log bot into discord
client.login(TOKEN).then(() => {
    console.log('We logged in bois')
}).catch(error => {
    console.log(error)
})