const mongoose = require('mongoose')
const db = require('./models')

// Grab from process.env, or default values if not provided
const {
  MONGO_DB_PORT = '27017', 
  MONGO_DB_HOST = 'localhost' 
} = process.env

mongoose.connect(`mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/assigments`)
mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully.')
})

module.exports = db
