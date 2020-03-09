const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/reminders.db', sqlite3.OPEN_READWRITE, (error) => {
    if (error) {
        return console.log(error.message)
    }

    console.log('Connected to the SQlite database')
})

module.exports = db