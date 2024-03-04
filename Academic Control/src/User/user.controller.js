'use strict'

import User from './user.model.js'
import { checkPassword, encrypt } from '../utils/encrypt.js'
import { generateJwt } from '../utils/jwt.js'
import { checkUpdate } from '../utils/validator.js'

export const testUser = (req, res) => {
    return res.send('Hello World')
}

export const teacherD = async (req, res) => {
    try {
        let exists = await User.findOne({ username: 'hbatres-2022143' })
        if (!exists) {
            let data = {
                name: 'Hermes',
                surname: 'Batres',
                username: 'hbatres-2022143',
                email: 'hbatres-2022143@kinal.edu.gt',
                password: '123',
                role: 'TEACHER_ROLE',
            }
            data.password = await encrypt(data.password)
            let user = new User(data)
            await user.save()
            console.log('First administrator created')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating administrator', err })
    }
}

export const register = async (req, res) => {
    try {
        let data = req.body
        let userName = await User.findOne({ username: data.username })
        if (userName) return res.status(406).send({ message: 'Username already used' })
        data.password = await encrypt(data.password)
        data.role = 'STUDENT_ROLE'
        let user = new User(data)
        user.save()
        return res.send({ message: 'Successful registration' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (user && await checkPassword(password, user.password)) {
            let loggerdUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggerdUser)
            return res.send({ message: `Welcome ${user.name}`, loggerdUser, token })
        }
        return res.status(401).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { uid, role } = req.user
        let data = req.body
        if (role == 'STUDENT_ROLE')
            if (id != uid)
                return res.status(403).send({ message: 'You cannot alter this users information.' })
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'Updated user successfully', updatedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async (req, res) => {
    try {
        let { id } = req.params
        let { uid, role } = req.user
        if (role == 'STUDENT_ROLE')
            if (!(id == uid))
                return res.status(403).send({ message: 'You cannot alter this users information.' })
        let deletedUser = await User.findOneAndDelete({ _id: id })
        if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}

export const changeaAdmin = async (req, res) => {
    try {
        let data = req.body
        let { username, password } = req.user
        if (username == 'hbatres-2022143' && await checkPassword('123', password)) {
            let userName = await User.findOne({ username: data.username })
            if (userName) return res.status(406).send({ message: 'Username already used' })
            data.password = await encrypt(data.password)
            data.role = 'TEACHER_ROLE'
            let user = new User(data)
            user.save()
            return res.send({ message: 'Course successfully added' })
        }
        return res.status(401).send({ message: 'You do not have an authorization of this rank' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error course could not be added', err })
    }
}