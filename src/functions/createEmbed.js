const { MessageEmbed } = require('discord.js')

const createEmbed = (messageToDeliverToUser, reminderTime) => {
    const embed = new MessageEmbed()
    .setTitle(`New reminder: ${messageToDeliverToUser}`)
    .setDescription(`Reminder set for: ${reminderTime}`)

    return embed
}

module.exports = createEmbed