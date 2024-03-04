import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { teacherD } from './src/User/user.controller.js'

initServer()
connect()
teacherD()
