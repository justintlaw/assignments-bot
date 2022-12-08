'use strict'

const express = require('express')
const cors = require('cors')

const app = express()
const routes = require('./routes')

app.use(cors()) // TODO: might need to fix this

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Add a responseData object as middleware any request can use
app.use((req, res, next) => {
  req.responseData = {}
  next()
})

app.use('/api', routes)

// health check endpoint
app.get('/', (req, res) => {
  res.send('ok')
})

// Basic handling for when an error is thrown
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ message: err.message })
})

exports.app = app
