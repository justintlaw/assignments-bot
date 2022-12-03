'use strict'

const express = require('express')
const router = express.Router()
const assignmentRequests = require('./assignments')

router.use('/assignments', assignmentRequests)

module.exports = router
