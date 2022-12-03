'use strict'

const express = require('express')
const ash = require('express-async-handler')

const {
  getAllAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignments')

const router = express.Router()

/**
 * Get all assignments
 */
router.get('/',
  ash(getAllAssignments),
  (req, res) => res.json(req.responseData)
)

/**
 * Get assignment by id
 */
router.get('/:id',
  ash(getAssignment),
  (req, res) => res.json(req.responseData)
)

/**
 * Create an assignment
 */
 router.post('/',
 ash(createAssignment),
 (req, res) => res.json(req.responseData)
)

/**
 * Update an assignment
 */
 router.post('/:id',
 ash(updateAssignment),
 (req, res) => res.json(req.responseData)
)

/**
 * Delete an assignment
 */
 router.delete('/:id',
 ash(deleteAssignment),
 (req, res) => res.json(req.responseData)
)

module.exports = router
