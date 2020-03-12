const db = require('../../db/config')
const moment = require('moment')

const currentTime = moment().utc().format('YYYY-MM-DD HH:mm:ss')

const saveNewReminder = (msgAuthorID, msgAuthorUsername, messageToDeliverToUser, reminderTime) => {
    db.serialize(() => {
        db.run("INSERT INTO reminders (userID, userName, message, createdAt, reminderTime) VALUES (?, ?, ?, ?, ?)", [msgAuthorID, msgAuthorUsername, messageToDeliverToUser, currentTime, reminderTime])
    
        db.run("SELECT * FROM reminders", (error) => {
            if (error) {
                return console.log(error)
            }
        })
    })
}

module.exports = saveNewReminder