'use strict'

require('dotenv').config()

const fs = require('fs')
const path = require('path')

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js')
const { BOT_TOKEN } = process.env

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds
  ],
  partials: [
    Partials.Channel
  ]
})

client.commands = new Collection()

// import commands
const commandsPath = path.join(__dirname, 'commands')
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

// import events
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(BOT_TOKEN)
