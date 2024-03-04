'use strict'

import mongoose from 'mongoose'
import { Schema, model } from 'mongoose'

export const courseSchema = Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        uppercase: true,
        enum: ['CUARTO DIVERSIFICADO', 'QUINTO DIVERSIFICADO', 'SEXTO DIVERSIFICADO'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }]
})

export default model('course', courseSchema)
