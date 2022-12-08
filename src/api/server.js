'use strict'

// Use process.env for port or default to 3000
const { PORT = '3000' } = process.env
const { app } = require('./app')

app.listen(PORT, () => console.log('API listening on port ' + PORT))
