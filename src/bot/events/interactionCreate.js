const { Events, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(`Error executing ${interaction.commandName}`)
      console.error(err)
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })    
    }
  }
}
