require('dotenv').config()

const fs = require('node:fs')

const { REST, Routes } = require('discord.js')
const { BOT_TOKEN, BOT_CLIENT_ID } = process.env

const commands = []
const ignoreList = []

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  if (!ignoreList.includes(file.split('.')[0])) {
    const command = require(`./commands/${file}`)

    commands.push(command.data.toJSON())
  }
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN)

const register = async () => {
  try {
    console.log('Started refreshing application (/) command(s).')
    const data = await rest.put(Routes.applicationCommands(BOT_CLIENT_ID), { body: commands })

    console.log(`Successfully reloaded ${data.length} application (/) command(s).`)
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  register
}

