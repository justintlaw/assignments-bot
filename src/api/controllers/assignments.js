'use strict'

const db = require('../db')
const errors = require('../errors')

const getAllAssignments = async (req, res, next) => {
  const { upcoming  } = req.query

  let assignments

  try {
    if (!upcoming) {
      assignments = await db.Assignment.find().sort({ dueDate: 1}) // ascending order
    } else {
      if (isNaN(upcoming)) {
        throw new Error('Upcoming parameter must be a number.')
      }
  
      assignments = await db.Assignment.find({
        dueDate: { 
          $gte: new Date(),
          $lte: new Date().setDate(new Date().getDate() + Number(upcoming))
        }
      }).sort({ dueDate: 1 }) // ascending order
    }

    req.responseData = assignments
  } catch (err) {
    throw new errors.InternalServerError('Failed to find assignments')
  }

  return next()
}

const getAssignment = async (req, res, next) => {
  const assignment = await db.Assignment.findById(req.params.id)

  if (!assignment) {
    throw new errors.NotFoundError(`Assignment with id ${req.params.id} not found.`)
  }

  req.responseData = assignment

  return next()
}

const createAssignment = async (req, res, next) => {
  const { title, points, dueDate } = req.body

  try {
    const assignment = await db.Assignment.create({
      title,
      points,
      dueDate: new Date(dueDate)
    })
  
    req.responseData = assignment
  } catch (err) {
    throw new errors.BadRequestError(err.message)
  }

  return next()
}

const updateAssignment = async (req, res, next) => {
  const { title, points, dueDate } = req.body
  const { id } = req.params

  try {
    const assignment = await db.Assignment.findById(id)
    assignment.title = title ?? assignment.title
    assignment.points = points ?? assignment.points
    assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate
  
    await assignment.save()
  
    req.responseData = assignment
  } catch (err) {
    throw new errors.BadRequestError(err.messagE)
  }

  return next()
}

const deleteAssignment = async (req, res, next) => {
  const { id } = req.params

  const result = await db.Assignment.findByIdAndDelete(id)
  
  if (!result) {
    throw new errors.NotFoundError(`Assignment with id ${id} not found.`)
  }

  res.status(204)

  return next()
}

module.exports = {
  getAllAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
}
