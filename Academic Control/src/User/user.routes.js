'use strict'

import { Router } from 'express'
import { deleteU, login, register, testUser, update, changeaAdmin } from './user.controller.js'
import { validateJwt } from '../middlewares/validate.jwt.js'

const api = Router()

api.get('/test', testUser)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)
api.delete('/deleteU/:id', [validateJwt], deleteU)
api.put('/changeaAdmin/:id', [validateJwt], changeaAdmin)

export default api