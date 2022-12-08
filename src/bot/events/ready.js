const { Events, Client } = require('discord.js')
const { register } = require('../register')

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   * 
   * @param {Client} client 
   */
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)

    await register()
  }
}
