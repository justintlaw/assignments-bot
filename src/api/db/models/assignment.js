const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const assignmentSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, required: true },
  points: { type: Number, required: true },
  dueDate: { type: Date, required: true }
})

assignmentSchema.pre('validate', function(next) {
  if (!this._id) this._id = uuid()
  next()
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment
