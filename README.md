# discord-reminder-bot
Request a reminder via DM through a discord bot

### Current status
- Successfully extracting keywords and integers from discord messages and assigning them to variables
- Using variables after extraction with MomentJS to create a future reminderTime

Eventually, when the bot is in any given server, you will be able to type something along the lines of 
`!remindme in 1 week to schedule a meeting with Bob for the 17th`

The bot will then save that reminder datetime and DM you with the message you originally posted

### In the works:

Currently looking into how to store new reminder requests, where to store them and how to have the bot:
1. Know when to extract a stored reminder and send it to the user
2. Be able to actually DM the specific user with a string comprised of their original request
