'use strict'

import { Schema, model } from 'mongoose'

export const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        requerid: true
    },
    email: {
        type: String,
        requerid: true
    },
    password: {
        type: String,
        requerid: true,
        minLength: [8, 'Password must be 8 characters']
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        requerid: true
    }
})

export default model('user', userSchema)
