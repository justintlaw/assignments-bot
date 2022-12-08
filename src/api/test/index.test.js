const request = require('supertest')
const { app } = require('../app')
const appRequest = request(app)
const mongoose = require('mongoose')

const ASSIGNMENTS_URL = '/api/assignments'

// Must run test with a fresh MongoDB container
describe('Application Tests', () => {
  afterAll(async () => {
    // Close db connection so tests can end
    await mongoose.connection.close()
  })

  describe('GET /', () => {
    it('should return ok', async () => {
      const healthCheckResult = await appRequest
        .get('/')
  
      expect(healthCheckResult.status).toBe(200)
    })
  })

  describe('POST /api/assignments', () => {
    it('should create an assignment', async () => {
      const createAssignmentResult = await appRequest
        .post(ASSIGNMENTS_URL)
        .send({
          title: 'Homework 1',
          points: 10,
          dueDate: '2022-12-06T20:52:16.059Z'
        })

      expect(createAssignmentResult.status).toBe(200)
      expect(createAssignmentResult.body._id).toBeTruthy()

      // delete id as it is random every time
      delete createAssignmentResult.body._id
      expect(createAssignmentResult.body).toMatchSnapshot()
    })
  })

  describe('POST /api/assignments/:id', () =>{
    let assignmentId

    beforeAll(async () => {
      const createAssignmentResult = await appRequest
        .post(ASSIGNMENTS_URL)
        .send({
          title: 'Homework 2',
          points: 10,
          dueDate: '2022-12-06T20:52:16.059Z'
        })

      expect(createAssignmentResult.status).toBe(200)

      assignmentId = createAssignmentResult.body._id
    })

    it('should update an assignment', async () => {
      const updateAssignmentResult = await appRequest
        .post(`${ASSIGNMENTS_URL}/${assignmentId}`)
        .send({
          title: 'Homework 3',
          points: 10,
          dueDate: '2022-12-09T20:52:16.059Z'
        })

      expect(updateAssignmentResult.status).toBe(200)
      expect(updateAssignmentResult.body._id).toBeTruthy()

      // delete id as it is random every time
      delete updateAssignmentResult.body._id
      expect(updateAssignmentResult.body).toMatchSnapshot()      
    })
  })

  describe('GET /api/assignments/:id', () => {
    let assignmentId

    beforeAll(async () => {
      const createAssignmentResult = await appRequest
        .post(ASSIGNMENTS_URL)
        .send({
          title: 'Homework 4',
          points: 10,
          dueDate: '2022-12-06T20:52:16.059Z'
        })

      expect(createAssignmentResult.status).toBe(200)

      assignmentId = createAssignmentResult.body._id
    })

    it('should get an assignment', async () => {
      const getAssignmentResult = await appRequest
        .get(`${ASSIGNMENTS_URL}/${assignmentId}`)
        .send()

      expect(getAssignmentResult.status).toBe(200)
      expect(getAssignmentResult.body._id).toBeTruthy()

      // delete id as it is random every time
      delete getAssignmentResult.body._id
      expect(getAssignmentResult.body).toMatchSnapshot()    
    })
  })

  describe('GET /api/assignments', () => {
    const days = 5

    beforeAll(async () => {
      const [createAssignmentResult1, createAssignmentResult2] = await Promise.all([
        appRequest
        .post(ASSIGNMENTS_URL)
        .send({
          title: 'Homework 5',
          points: 10,
          dueDate: new Date().toISOString()
        }),
        appRequest
        .post(ASSIGNMENTS_URL)
        .send({
          title: 'Homework 6',
          points: 10,
          dueDate: new Date().setDate(new Date().getDate() + Number(days + 1))
        })
      ])

      expect(createAssignmentResult1.status).toBe(200)
      expect(createAssignmentResult2.status).toBe(200)
    })

    it('should get all assignments', async () => {
      const getAllAssignmentResult = await appRequest
        .get(ASSIGNMENTS_URL)
        .send()

      expect(getAllAssignmentResult.status).toBe(200)
      expect(getAllAssignmentResult.body.length).toBeGreaterThan(1)

      getAllAssignmentResult.body.forEach(assignment => {
        expect(new Date(assignment.dueDate)).toBeInstanceOf(Date)
      })

      expect(getAllAssignmentResult.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String),
          points: expect.any(Number),
          dueDate: expect.any(String)
        })
      ]))      
    })

    it('should get all assignments in the next x number of days', async () => {
      const getAllAssignmentResult = await appRequest
        .get(`${ASSIGNMENTS_URL}?upcoming=${days}`)
        .send()

      expect(getAllAssignmentResult.status).toBe(200)
      expect(getAllAssignmentResult.body.length).toBe(1)

      getAllAssignmentResult.body.forEach(assignment => {
        expect(new Date(assignment.dueDate)).toBeInstanceOf(Date)
      })

      expect(getAllAssignmentResult.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String),
          points: expect.any(Number),
          dueDate: expect.any(String)
        })
      ]))            
    })
  })
})
