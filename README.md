# discord-reminder-bot
Request a scheduled reminder via DM through a discord bot

### Current status
  - Bot is successfully adding reminders to DB on UTC timezone
  - Successfully extracting discord user ID from DB and sending DM at correct time with original reminder message

Eventually, when the bot is in any given server, you will be able to type something along the lines of 
`!remindme in 1 week to schedule a meeting with Bob for the 17th`

The bot will then save that reminder datetime and DM you with the reminder you requested

### In the works:

- Refactor code / file structure to condense index.js
