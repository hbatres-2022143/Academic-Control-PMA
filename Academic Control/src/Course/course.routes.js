'use strict'

import { Router } from 'express'
import { allCourses, deleteC, joinCourse, registerCourse, testCourse, updateC } from './course.controller.js'
import { isStudent, isTeacher, validateJwt } from '../middlewares/validate.jwt.js'

const api = Router()

api.get('/testCourse', testCourse)
api.post('/registerCourse', [validateJwt, isTeacher], registerCourse)
api.get('/allCourses', [validateJwt], allCourses)
api.put('/updateC/:id', [validateJwt, isTeacher], updateC)
api.delete('/deleteC/:id', [validateJwt, isTeacher], deleteC)
api.put('/joinCourse/:id', [validateJwt, isStudent], joinCourse)

export default api
