'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoute from '../src/User/user.routes.js'
import courseRoute from '../src/Course/course.routes.js'

const app = express()
config()
const port = process.env.PORT || 2880

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use(userRoute)
app.use(courseRoute)

export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
