'use strict'

const axios = require('axios')

const {
  API_PORT = 3000,
  NETWORK_GATEWAY = 'localhost'
} = process.env
const API_BASE_URL = `http://${NETWORK_GATEWAY}:${API_PORT}/api`

const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  bold
} = require('discord.js')

const formatAssignment = (data) => {
  return [
    bold(data.title),
    `Due: ${new Date(data.dueDate).toLocaleString()}`,
    `Points: ${data.points}`
  ].join('\n')
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upcoming')
    .setDescription('Find upcoming assignments,')
    .addIntegerOption(option =>
      option.setName('days')
        .setDescription('How many days ahead to look.')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(120)),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return

    const days = interaction.options.getInteger('days') || '120'

    let assignments = []

    try {
      assignments = (await axios.get(`${API_BASE_URL}/assignments?upcoming=${days}`)).data
    } catch (err) {
      console.error(err)
      await interaction.reply({
        content: 'Failed to fetch assignments.',
        ephemeral: true
      })
      return
    }

    if (assignments.length === 0) {
      await interaction.reply({
        content: 'There are no upcoming assignments.',
        ephemeral: true
      })
      return
    }

    const message = assignments.map((a) => formatAssignment(a)).join('\n\n')

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Upcoming Assignments')
      .setDescription(message)

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    })
  }
}
