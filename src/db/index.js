const mongoose = require('mongoose')
const db = require('./models')
const { MONGO_DB_PORT, MONGO_DB_HOST } = process.env

mongoose.connect(`mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/assigments`)
mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully.')
})

module.exports = db
