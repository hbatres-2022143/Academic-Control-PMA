'use strict'

import Course from './course.model.js'

export const testCourse = (req, res) => {
    return res.send('Hello World')
}

export const registerCourse = async (req, res) => {
    try {
        let { uid } = req.user
        let data = req.body
        let { role } = req.user
        if (role == 'STUDENT_ROLE')
            return res.status(401).send({ message: 'You do not have authorization' })
        if (data.teacher != uid)
            return res.status(401).send({ message: 'You do not have authorization' })
        let curs = new Course(data)
        await curs.save()
        return res.send({ message: 'Course added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Could not add course error', err })
    }
}

export const allCourses = async (req, res) => {
    try {
        let { uid, role } = req.user
        let curse
        if (role == 'TEACHER_ROLE')
            curse = await Course.find({ teacher: uid })
        else if (role == 'STUDENT_ROLE')
            curse = await Course.find({ students: uid })
        return res.send({ message: curse })
    } catch (err) {
        console.error(err)
        return res.status(404).send({ message: 'Search error' })
    }
}

export const updateC = async (req, res) => {
    try {
        let { id } = req.params
        let cursoData = await Course.findOne({ _id: id })
        let { uid } = req.user
        if (cursoData.teacher != uid) return res.status(403).send({ message: 'You do not have authorization to modify the course' })
        let data = req.body
        let updateC = await Course.findOneAndUpdate(
            { _id: id },
            data,
            { new: true })
        if (!updateC) return res.status(401).send({ message: 'The course could not be updated' })
        return res.send({ message: 'Course updated successfully', updateC })
    } catch (error) {
        console.error(err)
        return res.status(404).send({ message: 'Error updating course' })
    }
}

export const deleteC = async (req, res) => {
    try {
        let { uid } = req.user
        let { id } = req.params
        let courseData = await Course.findOne({ _id: id })
        if (!courseData) return res.status(404).send({ message: 'Course not found' })
        if (courseData.teacher != uid) return res.status(403).send({ message: 'You do not have authorization to modify the course' })
        let deleteCur = await Course.findOneAndDelete({ _id: id })
        if (!deleteCur) return res.status(404).send({ message: 'The course could not be deleted' })
        return res.send({ message: `The course: ${deleteCur.name} has been successfully deleted` })
    } catch (err) {
        console.error(err)
        return res.status(404).send({ message: 'Error deleting course' })
    }
}

export const joinCourse = async (req, res) => {
    try {
        let { id, role } = req.params
        let { uid } = req.user
        let courseStudent = await Course.find({ students: uid })
        let course = await Course.findOne({ _id: id })
        if (!course) return res.status(404).send({ message: 'Course not found' })
        if (role == 'TEACHER_ROLE') return res.status(403).send({ message: 'You are a teacher, you cannot join classes.' })
        if (course.students && !(course.students.includes(uid))) {
            if (courseStudent.length < 3) {
                course.students.push(uid)
                await course.save()
                return res.send({ message: 'You have successfully joined' })
            }
            return res.send({ message: 'It is not possible to join more courses' })
        }
        return res.status(400).send({ message: 'You are already enrolled in this course' })
    } catch (err) {
        console.error(err)
        return res.status(404).send({ message: 'Error when adding' })
    }
}