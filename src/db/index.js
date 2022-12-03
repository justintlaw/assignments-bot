const mongoose = require('mongoose')
const db = require('./models')
const { MONGO_DB_PORT } = process.env

mongoose.connect(`mongodb://localhost:${MONGO_DB_PORT}/assigments`)
mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully.')
})

module.exports = db
